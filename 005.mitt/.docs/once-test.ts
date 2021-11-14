import mittOnce from "./once";

type Events = {
	foo?: string;
};

const emitter = mittOnce<Events>();

function A() {
	console.log("A");
}

function B() {
	console.log("B");
}

emitter.on("foo", A);
emitter.once("foo", B);
emitter.emit("foo"); // A B
emitter.emit("foo"); // A

// __订阅 * 有意义吗？
// emit 触发一次，执行 * 那么这时候的 * 执行并且自动解绑，再触发也不会执行了。
// emitter.once('*', (e) => {

// })
