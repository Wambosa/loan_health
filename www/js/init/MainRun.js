//optional web shim
if(!window.cordova && !window.device) {
    new AppShim();}

//note: the view models have to be global in order for kendo to see them
interactiveGraphViewModel = null;

proxy = new Proxy(new Http());

isViewModelInit = false;

DEVICE = new Device(initViewModels);

function initViewModels(){

    if(!isViewModelInit){
        isViewModelInit = true;

        proxy.getUserData(1234, function(userData){

            console.log(userData);

            interactiveGraphViewModel = new InteractiveGraph(userData).applyBindings();

            var chartOptions = {
                title: userData.name + "'s plan",
                isStacked: true,
                height: interactiveGraphViewModel.chartHeight,
                legend: {position: 'top', maxLines: 2},
                vAxis: {minValue: 0},
                animation:{
                    duration: 1000,
                    easing: 'out',
                },
                colors: ['#79c36a', '#f9a65a', '#f1595f'] // green, orange, red
            };

            interactiveGraphViewModel.draw(
                'ColumnChart',
                'chart_div',
                chartOptions
            );
        });

        interactiveGraphViewModel.slider = $("#payment-slider").kendoSlider({
            increaseButtonTitle: "Right",
            decreaseButtonTitle: "Left",
            min: 25,
            max: 1000,
            smallStep: 50,
            largeStep: 100,
            value: interactiveGraphViewModel.monthlyPayment(),
            slide: interactiveGraphViewModel.onSlide.bind(interactiveGraphViewModel)
        }).data("kendoSlider");

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
    }
}

function resetScrollBar(){
    app.scroller().reset();
}

function initScrollBarListener(){
    //note: needs to fire each time a view is instantiated for the first time only.
    //this is a hack to hide the keyboard when scrolling begins
    if(app.scroller().userEvents._events.start.length === 1){
        app.scroller().userEvents._events.start.push(function(){
            document.activeElement.blur();
            document.activeElement.blur();//redundancy for some glitchies
            //var inputs = document.querySelectorAll('input');
            //for(var i=0; i < inputs.length; i++) {inputs[i].blur();}
            }
        );
    }
}