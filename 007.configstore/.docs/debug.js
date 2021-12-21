import Configstore from '../index.js'

const config = new Configstore('configstore-debug', {
	name: 'lian'
});

config.set('foo', 'bar');
config.get('foo');
