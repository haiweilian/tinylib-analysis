import mitt from "../src/index";

type Events = {
	foo: string;
	bar?: number;
	obj: {
		name: string
	}
};

const emitter = mitt<Events>();

emitter.on("foo", (e) => {});
emitter.emit("foo");
emitter.emit("foo", "1");

emitter.on("bar", (e) => {})
emitter.emit("bar")
emitter.emit("bar", 1)

emitter.on('*', (e)=>{})
