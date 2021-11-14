function a () {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(1)
			console.log(1)
		}, 2000)
	})
}

function b() {
	console.log(2)
	return 2
	// throw new Error('111')
}

let all = Promise.all([
	Promise.resolve(a()),
	Promise.resolve(b())
])
all.then(res => {
	console.log(res)
}).catch(e => {
	console.log(e)
})

Promise.resolve().then(() => Promise.resolve(a())).then(Promise.resolve(b())).then(res => {
	console.log(res)
})
