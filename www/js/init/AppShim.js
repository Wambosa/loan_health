//this shim only gets run in browser mode.
function AppShim() {

	console.warn('AppShim instantiated!');
	LocalFileSystem = { PERSISTENT: 1 };
	window.requestFileSystem = function () { };

	var timeBeforeFakeEvent = 250;

	device = {
		cordova: 'DEV_SHIM',
		model: 'PERFECT CELL',
		platform: 'GERO',
		uuid: 'android17+android18',
		version: '21',
		cameraSettings: { quality: 9000 }
	};

	navigator.app = {
		exitApp: function () { console.warn('fake exitApp called...'); }
	};

	window.setTimeout(function () {
		if (!DEVICE.isDeviceReady) {
			console.warn('Triggering fake deviceready for web browser mode');
			document.dispatchEvent(new CustomEvent('deviceready', {
				"type": "deviceready"
			}));
		}

		console.warn('overriding DEVICE methods for browser testing');
		DEVICE.redirect = function (url) { document.location = url; };

	}, timeBeforeFakeEvent);
}
