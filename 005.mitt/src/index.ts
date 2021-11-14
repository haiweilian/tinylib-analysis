// 事件类型
export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
// 基础回调函数
export type Handler<T = unknown> = (event: T) => void;
// 通配符回调函数
export type WildcardHandler<T = Record<string, unknown>> = (
	type: keyof T,
	event: T[keyof T]
) => void;

// An array of all currently registered event handlers for a type
// 基础回调集合
export type EventHandlerList<T = unknown> = Array<Handler<T>>;
// 通配符的回调集合
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;

// A map of event types and their corresponding event handlers.
// 事件类型和回调的映射 { foo: [fn1, fn2] }
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
	keyof Events | '*',
	EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

// Emitter 实例类型
export interface Emitter<Events extends Record<EventType, unknown>> {
	all: EventHandlerMap<Events>;

	// 函数重载 "on"
	// 类型约束 Key extends keyof Events
	// 索引类型查询操作符 keyof Events
	// 索引访问操作符 Events[Key]
	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
	on(type: '*', handler: WildcardHandler<Events>): void;

	off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
	off(type: '*', handler: WildcardHandler<Events>): void;

	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
	emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt<Events extends Record<EventType, unknown>>(
	// 初始化
	all?: EventHandlerMap<Events>
): Emitter<Events> {

	type GenericEventHandler =
		| Handler<Events[keyof Events]>
		| WildcardHandler<Events>;

	// 使用 Map 收集
	all = all || new Map();

	return {

		/**
		 * A Map of event names to registered handler functions.
		 */
		all,

		/**
		 * Register an event handler for the given type.
		 * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
		 * @param {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
			// 获取到对应类型集合
			const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
			// 如果已存在，直接 push 追加
			if (handlers) {
				handlers.push(handler);
			}
			else {
				// 反之，创建一个新的集合
				all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
			}
		},

		/**
		 * Remove an event handler for the given type.
		 * If `handler` is omitted, all handlers of the given type are removed.
		 * @param {string|symbol} type Type of event to unregister `handler` from, or `'*'`
		 * @param {Function} [handler] Handler function to remove
		 * @memberOf mitt
		 */
		off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
			// 获取到对应类型集合
			const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
			if (handlers) {
				if (handler) {
					// 回调存在，找到对应的函数删除，只删除一个。
					// 关于 -1 >>> 0 ： https://segmentfault.com/a/1190000014613703
					handlers.splice(handlers.indexOf(handler) >>> 0, 1);
				}
				else {
					// 不存在清空此类型收集的回调
					all!.set(type, []);
				}
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `'*'` handlers are invoked after type-matched handlers.
		 *
		 * Note: Manually firing '*' handlers is not supported.
		 *
		 * @param {string|symbol} type The event type to invoke
		 * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
			let handlers = all!.get(type);
			if (handlers) {
				(handlers as EventHandlerList<Events[keyof Events]>)
					// Why use slice: https://github.com/developit/mitt/pull/109
					.slice()
					// 执行对应类型的所有回调
					.map((handler) => {
						handler(evt!);
					});
			}

			// 每次派发都执行通配符的回调
			handlers = all!.get('*');
			if (handlers) {
				(handlers as WildCardEventHandlerList<Events>)
					.slice()
					.map((handler) => {
						handler(type, evt!);
					});
			}
		}
	};
}
