// note: optional debugging web shim
if(!window.cordova && !window.device)
    new AppShim();

//note: the view models have to be global in order for kendo to see them
StatusBar = null;

// TODO: rename this to something other than healthGraph.
healthGraph = null;

proxy = new Proxy(new Http());

DEVICE = new Device(function initViewModels(){

    proxy.getUserData(1111, function(userData){

        healthGraph = new HealthGraph(userData);

        if (StatusBar)
            StatusBar.hide();
    });

    window.app = new kendo.mobile.Application(document.body, {
        layout: "home-page",
        transition: "slide",
        skin: "nova",
        icon: {
            "" : '@Url.Content("~/icon.png")',
            "128x128" : '@Url.Content("~/icon.png")',
            "256x256" : '@Url.Content("~/splash.png")'
        }
    });
});