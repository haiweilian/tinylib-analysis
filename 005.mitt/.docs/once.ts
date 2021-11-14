import mitt from "../src/index";
import type { EventType, EventHandlerMap, Emitter, Handler } from '../src/index';

// 继承 Emitter 基础接口
export interface EmitterOnce<Events extends Record<EventType, unknown>> extends Emitter<Events> {
	once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
}

export default function mittOnce<Events extends Record<EventType, unknown>>(
	all?: EventHandlerMap<Events>
): EmitterOnce<Events> {
	const emitter = mitt<Events>(all)

	return {
		// 原始方法
		...emitter,

		// 扩展 once
		once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
			const fn = (arg: Events[Key]) => {
				// 执行一次，立刻解除监听
				emitter.off(type, fn)
				handler(arg)
			}
			emitter.on(type, fn)
		}
	}
}
