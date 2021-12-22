// Symbols is a better way to do this, but not all browsers have good support,
// so instead we'll just make do with a very unlikely string.
const customArgumentsToken = "__ES6-PROMISIFY--CUSTOM-ARGUMENTS__";

/**
 * promisify()
 * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) --
 * into an ES6-compatible Promise. Promisify provides a default callback of the
 * form (error, result) and rejects when `error` is truthy.
 *
 * @param {function} original - The function to promisify
 * @return {function} A promisified version of `original`
 */
export function promisify(original) {
    // Ensure the argument is a function
    // 判断是否是一个函数
    if (typeof original !== "function") {
        throw new TypeError("Argument to promisify must be a function");
    }

    // If the user has asked us to decode argument names for them, honour that
    // 多个参数自定义的参数名称
    const argumentNames = original[customArgumentsToken];

    // If the user has supplied a custom Promise implementation, use it.
    // Otherwise fall back to whatever we can find on the global object.
    // 自定义的 Promise 或者 原生 Promise
    const ES6Promise = promisify.Promise || Promise;

    // If we can find no Promise implemention, then fail now.
    if (typeof ES6Promise !== "function") {
        throw new Error("No Promise implementation found; do you need a polyfill?");
    }

    // promisify(load) 返回一个函数，执行这个函数返回一个 Promise。
    return function (...args) {
        return new ES6Promise((resolve, reject) => {
            // Append the callback bound to the context
            // 忘 args 里追加 callback，那么在普通函数执行回调的时候，就是直接追加的这个函数
            args.push(function callback(err, ...values) {
                // 根据 node 错误优先的写法，判断是否有错误信息
                if (err) {
                    return reject(err);
                }

                // 如果参数剩余参数只有一个或者没有指定参数名称返回第一个
                if (values.length === 1 || !argumentNames) {
                    return resolve(values[0]);
                }

                // 如果指定了参数名称，转化为对象返回。
                const o = {};
                values.forEach((value, index) => {
                    const name = argumentNames[index];
                    if (name) {
                        o[name] = value;
                    }
                });

                resolve(o);
            });

            // Call the function.
            // 执行调用函数
            original.apply(this, args);
        });
    };
}

// Attach this symbol to the exported function, so users can use it
promisify.argumentNames = customArgumentsToken;
promisify.Promise = undefined;
