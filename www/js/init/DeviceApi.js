function Device(callback){
    var self = this;

    this.isDeviceReady = false;
    this.redirect = function(url){window.open(url, '_system');};

    document.addEventListener("deviceready", function() {
        if(!self.isDeviceReady) {

            self.isDeviceReady = true;

            self.cordova = device.cordova;
            self.model = device.model;
            self.platform = device.platform;
            self.uuid = device.uuid;
            self.version = device.version;

            if (callback)
                callback(self);
        }

    }, true);

    this.getDebugData = function(){
        return {
            debugApiVersion: DEVICE.cordova,
            debugDeviceModel: DEVICE.model,
            debugDevicePlatform: DEVICE.platform,
            debugDeviceUUID: DEVICE.uuid,
            debugDeviceVersion: DEVICE.version,
            debugApiCameraQuality: DEVICE.cameraSettings.quality,
            debugScreenWidth: window.screen.width,
            debugScreenHeight: window.screen.height,
            debugPixelRatio: window.devicePixelRatio
        };
    };

    return self;
}
