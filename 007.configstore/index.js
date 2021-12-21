import path from 'path';
import os from 'os';
// fs 模块的扩展
import fs from 'graceful-fs';
// linux 的基础目录
import {xdgConfig} from 'xdg-basedir';
// fs.writeFile 的扩展
import writeFileAtomic from 'write-file-atomic';
// 从嵌套对象中获取、设置或删除属性
import dotProp from 'dot-prop';
// 生成唯一的随机字符串
import uniqueString from 'unique-string';

// 获取配置目录，如果是 linux 则是 xdgCongfig, 反之获取临时文件的默认目录路径
const configDirectory = xdgConfig || path.join(os.tmpdir(), uniqueString());
// 权限错误提示语
const permissionError = 'You don\'t have access to this file.';
// 文件权限配置，0700、0600是 linux 表示权限的方式 https://blog.csdn.net/mlz_2/article/details/105250259
// 0600：拥有者具有文件的读、写权限，其他用户没有
// 0700：拥有者具有文件的读、写、执行权限，其他用户没有
const mkdirOptions = {mode: 0o0700, recursive: true};
const writeFileOptions = {mode: 0o0600};

export default class Configstore {
	constructor(id, defaults, options = {}) {
		// 获取到自定义的存储路径
		const pathPrefix = options.globalConfigPath ?
			path.join(id, 'config.json') :
			path.join('configstore', `${id}.json`);

		// 获取最终的存储路径，系统路径 + 自定义路径
		// /Users/lianhaiwei/.config/configstore/configstore-debug.json
		this._path = options.configPath || path.join(configDirectory, pathPrefix);

		// 如果传入默认值则初始化
		if (defaults) {
			this.all = {
				...defaults,
				...this.all
			};
		}
	}

	// 读取文件里的所有值
	get all() {
		try {
			return JSON.parse(fs.readFileSync(this._path, 'utf8'));
		} catch (error) {
			// Create directory if it doesn't exist
			if (error.code === 'ENOENT') {
				return {};
			}

			// Improve the message of permission errors
			if (error.code === 'EACCES') {
				error.message = `${error.message}\n${permissionError}\n`;
			}

			// Empty the file if it encounters invalid JSON
			if (error.name === 'SyntaxError') {
				writeFileAtomic.sync(this._path, '', writeFileOptions);
				return {};
			}

			throw error;
		}
	}

	// 设置所有值到文件
	set all(value) {
		try {
			// Make sure the folder exists as it could have been deleted in the meantime
			// 文件是否存在，不存在创建
			fs.mkdirSync(path.dirname(this._path), mkdirOptions);

			writeFileAtomic.sync(this._path, JSON.stringify(value, undefined, '\t'), writeFileOptions);
		} catch (error) {
			// Improve the message of permission errors
			if (error.code === 'EACCES') {
				error.message = `${error.message}\n${permissionError}\n`;
			}

			throw error;
		}
	}

	get size() {
		return Object.keys(this.all || {}).length;
	}

	// 获取一个值
	get(key) {
		return dotProp.get(this.all, key);
	}

	// 设置一个值
	set(key, value) {
		const config = this.all;

		if (arguments.length === 1) {
			for (const k of Object.keys(key)) {
				dotProp.set(config, k, key[k]);
			}
		} else {
			dotProp.set(config, key, value);
		}

		// 从新触发 set all 保存最新的值
		this.all = config;
	}

	has(key) {
		return dotProp.has(this.all, key);
	}

	delete(key) {
		const config = this.all;
		dotProp.delete(config, key);
		this.all = config;
	}

	clear() {
		this.all = {};
	}

	get path() {
		return this._path;
	}
}
