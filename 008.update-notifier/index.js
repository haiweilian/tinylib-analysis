'use strict';
const {spawn} = require('child_process');
const path = require('path');
const {format} = require('util');
// 懒加载模块
const importLazy = require('import-lazy')(require);
// 配置存储
const configstore = importLazy('configstore');
// 终端字符颜色
const chalk = importLazy('chalk');
// 语义化版本
const semver = importLazy('semver');
// 语义化版本比较差异
const semverDiff = importLazy('semver-diff');
// 获取 npm 上的最新版本号
const latestVersion = importLazy('latest-version');
// 检测运行文件的报管理工具 npm or yarn
const isNpm = importLazy('is-npm');
// 检测安装包是否全局安装
const isInstalledGlobally = importLazy('is-installed-globally');
// 检测安装包是否 yarn 全局安装
const isYarnGlobal = importLazy('is-yarn-global');
// 检测项目是否使用 yarn
const hasYarn = importLazy('has-yarn');
// 在终端创建一个框显示
const boxen = importLazy('boxen');
// 配置基础路径
const xdgBasedir = importLazy('xdg-basedir');
// 检测当前环境是否是持续集成环境
const isCi = importLazy('is-ci');
// 占位符的模板
const pupa = importLazy('pupa');
// 一天的时间戳
const ONE_DAY = 1000 * 60 * 60 * 24;

class UpdateNotifier {
	// 解析配置阶段
	constructor(options = {}) {
		// 解析配置，从不同参数中解析出 packageName 和 packageVersion
		this.options = options;
		options.pkg = options.pkg || {};
		options.distTag = options.distTag || 'latest';

		// Reduce pkg to the essential keys. with fallback to deprecated options
		// TODO: Remove deprecated options at some point far into the future
		options.pkg = {
			name: options.pkg.name || options.packageName,
			version: options.pkg.version || options.packageVersion
		};

		if (!options.pkg.name || !options.pkg.version) {
			throw new Error('pkg.name and pkg.version required');
		}

		this.packageName = options.pkg.name;
		this.packageVersion = options.pkg.version;

		// 检测更新的间隔时间
		this.updateCheckInterval = typeof options.updateCheckInterval === 'number' ? options.updateCheckInterval : ONE_DAY;

		// 是否禁用
		this.disabled = 'NO_UPDATE_NOTIFIER' in process.env ||
			process.env.NODE_ENV === 'test' ||
			process.argv.includes('--no-update-notifier') ||
			isCi();

		// npm 脚本时通知
		this.shouldNotifyInNpmScript = options.shouldNotifyInNpmScript;

		if (!this.disabled) {
			try {
				// 存储配置到本地文件
				const ConfigStore = configstore();
				this.config = new ConfigStore(`update-notifier-${this.packageName}`, {
					optOut: false,
					// Init with the current time so the first check is only
					// after the set interval, so not to bother users right away
					lastUpdateCheck: Date.now()
				});
			} catch {
				// Expecting error code EACCES or EPERM
				const message =
					chalk().yellow(format(' %s update check failed ', options.pkg.name)) +
					format('\n Try running with %s or get access ', chalk().cyan('sudo')) +
					'\n to the local update config store via \n' +
					chalk().cyan(format(' sudo chown -R $USER:$(id -gn $USER) %s ', xdgBasedir().config));

				process.on('exit', () => {
					console.error(boxen()(message, {align: 'center'}));
				});
			}
		}
	}

	// 检测更新阶段
	check() {
		if (
			!this.config ||
			this.config.get('optOut') ||
			this.disabled
		) {
			return;
		}

		// 获取到更新信息
		this.update = this.config.get('update');

		if (this.update) {
			// Use the real latest version instead of the cached one
			this.update.current = this.packageVersion;

			// Clear cached information
			this.config.delete('update');
		}

		// Only check for updates on a set interval
		// 是否超过检测的间隔时间
		if (Date.now() - this.config.get('lastUpdateCheck') < this.updateCheckInterval) {
			return;
		}

		// Spawn a detached process, passing the options as an environment property
		// 执行检测脚本
		spawn(process.execPath, [path.join(__dirname, 'check.js'), JSON.stringify(this.options)], {
			detached: true,
			stdio: 'ignore'
		}).unref();
	}

	async fetchInfo() {
		// 获取到最新的版本信息
		const {distTag} = this.options;
		const latest = await latestVersion()(this.packageName, {version: distTag});
		// 返回两个版本的差异信息
		return {
			latest,
			current: this.packageVersion,
			type: semverDiff()(this.packageVersion, latest) || distTag,
			name: this.packageName
		};
	}

	// 通知更新阶段
	notify(options) {
		const suppressForNpm = !this.shouldNotifyInNpmScript && isNpm().isNpmOrYarn;
		if (!process.stdout.isTTY || suppressForNpm || !this.update || !semver().gt(this.update.latest, this.update.current)) {
			return this;
		}

		options = {
			isGlobal: isInstalledGlobally(),
			isYarnGlobal: isYarnGlobal()(),
			...options
		};

		// 根据环境提示命令
		let installCommand;
		if (options.isYarnGlobal) {
			installCommand = `yarn global add ${this.packageName}`;
		} else if (options.isGlobal) {
			installCommand = `npm i -g ${this.packageName}`;
		} else if (hasYarn()()) {
			installCommand = `yarn add ${this.packageName}`;
		} else {
			installCommand = `npm i ${this.packageName}`;
		}

		// 创建终端的提示信息
		const defaultTemplate = 'Update available ' +
			chalk().dim('{currentVersion}') +
			chalk().reset(' → ') +
			chalk().green('{latestVersion}') +
			' \nRun ' + chalk().cyan('{updateCommand}') + ' to update';

		const template = options.message || defaultTemplate;

		options.boxenOptions = options.boxenOptions || {
			padding: 1,
			margin: 1,
			align: 'center',
			borderColor: 'yellow',
			borderStyle: 'round'
		};

		const message = boxen()(
			pupa()(template, {
				packageName: this.packageName,
				currentVersion: this.update.current,
				latestVersion: this.update.latest,
				updateCommand: installCommand
			}),
			options.boxenOptions
		);

		if (options.defer === false) {
			console.error(message);
		} else {
			process.on('exit', () => {
				console.error(message);
			});

			process.on('SIGINT', () => {
				console.error('');
				process.exit();
			});
		}

		return this;
	}
}

module.exports = options => {
	const updateNotifier = new UpdateNotifier(options);
	updateNotifier.check();
	return updateNotifier;
};

module.exports.UpdateNotifier = UpdateNotifier;
