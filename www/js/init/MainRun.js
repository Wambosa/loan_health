// note: optional debugging web shim
if(!window.cordova && !window.device)
    new AppShim();

//note: the view models have to be global in order for kendo to see them
StatusBar = null;
healthGraph = null;

proxy = new Proxy(new Http());

DEVICE = new Device(function initViewModels(){

    proxy.getUserData(1234, function(userData){

        console.log(userData);
        console.log(DEVICE.getDebugData());

        healthGraph = new HealthGraph(userData).applyBindings();

        var chartOptions = {
            title: userData.name + "'s plan",
            isStacked: true,
            height: healthGraph.chartHeight(),
            width: healthGraph.chartWidth(),
            legend: {position: 'top', maxLines: 2},
            vAxis: {minValue: 0},
            animation:{
                duration: 333,
                easing: 'out',
            },
            backgroundColor: '#f7f7f7',
            colors: ['#79c36a', '#f9a65a', '#f1595f'] // green, orange, red
        };

        healthGraph.draw(
            'ColumnChart',
            'chart_div',
            chartOptions
        );

        if(StatusBar)
            StatusBar.hide();
    });

    healthGraph.slider = $("#payment-slider").kendoSlider({
        increaseButtonTitle: "Right",
        decreaseButtonTitle: "Left",
        min: 50,
        max: 1500,
        smallStep: 50,
        largeStep: 100,
        value: healthGraph.monthlyPayment(),
        slide: healthGraph.onSlide.bind(healthGraph)
    }).data("kendoSlider");
    healthGraph.slider.wrapper.css("width", "100%");

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