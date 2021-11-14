import mitt from "../src/index";
import type { EventType, EventHandlerMap, Emitter, EventHandlerList, WildCardEventHandlerList } from '../src/index';

// 继承 Emitter 基础接口
export interface EmitterAsync<Events extends Record<EventType, unknown>> extends Emitter<Events> {
	emitSerial<Key extends keyof Events>(type: Key, event: Events[Key]): Promise<void>;
	emitSerial<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): Promise<void>;

	emitParallel<Key extends keyof Events>(type: Key, event: Events[Key]): Promise<void>;
	emitParallel<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): Promise<void>;
}

export default function mittAsync<Events extends Record<EventType, unknown>>(
	all?: EventHandlerMap<Events>
): EmitterAsync<Events> {
	const emitter = mitt<Events>(all)

	return {
		// 原始方法
		...emitter,

		// 串行	Promise.then().then()
		async emitSerial<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
			let handlers = emitter.all!.get(type);
			if (handlers) {
				const callbacks = (handlers as EventHandlerList<Events[keyof Events]>).slice()
				// compose run
				await callbacks.reduce(
					(promise, callback) => promise.then(() => callback(evt!)),
					Promise.resolve()
				);
			}

			// 每次派发都执行通配符的回调
			handlers = emitter.all!.get('*');
			if (handlers) {
				const callbacks = (handlers as WildCardEventHandlerList<Events>).slice()
				// compose run
				await callbacks.reduce(
					(promise, callback) => promise.then(() => callback(type, evt!)),
					Promise.resolve()
				);
			}
		},

		// 并行	Promise.all
		async emitParallel<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
			let handlers = emitter.all!.get(type);
			if (handlers) {
				const callbacks = (handlers as EventHandlerList<Events[keyof Events]>).slice()
				// Promise.all run
				await Promise.all(
					callbacks.map((handler) => Promise.resolve(handler(evt!)))
				)
			}

			// 每次派发都执行通配符的回调
			handlers = emitter.all!.get('*');
			if (handlers) {
				const callbacks = (handlers as WildCardEventHandlerList<Events>).slice()
				// Promise.all run
				await Promise.all(
					callbacks.map((handler) => Promise.resolve(handler(type, evt!)))
				)
			}
		}
	}
}
