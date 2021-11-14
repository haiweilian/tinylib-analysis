import mittAsync from "./async";

type Events = {
	foo?: string;
};

const emitter = mittAsync<Events>();

async function A() {
	await new Promise(reslove => {
		setTimeout(() => {
			console.log("A");
			reslove("A")
		}, 2000)
	})
}

function B() {
	return new Promise(reslove => {
		setTimeout(() => {
			console.log("B");
			reslove("B")
		}, 1000)
	})
}

function C() {
	console.log("C");
}

emitter.on("foo", A);
emitter.on("foo", B);
emitter.on("foo", C);

// 原始 C D B A
emitter.emit("foo");
console.log("D");

// 串行 A B C D
// (async () => {
// 	await emitter.emitSerial("foo");
// 	console.log("D")
// })();

// 并行 C B A D
// (async () => {
// 	emitter.emitParallel("foo").then(() => {
// 		console.log("D")
// 	});
// })();
