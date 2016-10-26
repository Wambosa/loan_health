function HealthGraph(initData) {

    var self = this;

    this.mode = ko.observable(APPMODE.HISTORY);

    this.settings = {
        name: initData.name,
        vehicle: initData.vehicle,
        rate: "" + initData.rate + " %",
        payment: currency(initData.payment),
        principal: initData.principal,
        maturityDate: initData.maturityDate
    };

    this.charts = {};
    this.charts[APPMODE.HISTORY] = new InteractiveGraph();
    this.charts[APPMODE.SUMMARY] = new InteractiveGraph();
    this.charts[APPMODE.WHATIF] = new InteractiveGraph();

    this.setCurrentPayment = function (item) {
        self.currentPaymentDate(item.date);
        self.currentPaymentPrincipal('$ ' + item.principal);
        self.currentPaymentInterest('$ ' + item.interest);
        self.currentPaymentFee('$ ' + item.fee);
    };

    this.whatIfStatus = ko.observable("neutral");
       
    this.currentPaymentDate = ko.observable();
    this.currentPaymentPrincipal = ko.observable();
    this.currentPaymentInterest = ko.observable();
    this.currentPaymentFee = ko.observable();

    this.setCurrentPayment(initData.paymentHistory[0]);

    var updateDataTable = function (desiredYear) {
        self.activeChart().table = paymentDataToArray(self.activeDataSet(self.mode())
            .filter(yearFilter(desiredYear)));

        self.activeChart().table.unshift(chartHeaders);
        self.activeChart().reDraw();
    };

    // for display in a detailed list view.
    this.paymentHistory = reverse(initData.paymentHistory);
    this.paymentYears = ko.observableArray(getPaymentYears(initData.paymentHistory));
    this.selectedYear = ko.observable(last(this.paymentYears));
    this.selectedYear.subscribe(function (newYear) {
        updateDataTable(newYear);
    });

    this.slider = null;
    var minimumPayment = initData.payment * .5;
    this.monthlyPayment = ko.observable(initData.payment);
    this.monthlyPayment.subscribe(function (val) {
        if(val < minimumPayment)
            self.monthlyPayment(minimumPayment);

        self.slider.value(val);
        refreshWhatIfView();
    });

    this.selectedStrategy = ko.observable(first(paymentStrategies));
    this.selectedStrategy.subscribe(function (_) {
        refreshWhatIfView();
    });

    // a poor man's carosel.
    this.nextTip = function(e) {

        var offset = 0;
        if (e.direction === 'left') offset = 1;
        else if (e.direction === 'right') offset = -1;
        
        if (offset !== 0) {
            var next = self.tipIndex() + offset;

            if (next > tips.length - 1) next = 0;
            if (next < 0) next = tips.length - 1;

            self.tipIndex(next);

            self.currentTip(tips[self.tipIndex()]);
        }
    };

    this.tipIndex = ko.observable(0);
    this.currentTip = ko.observable(tips[0]);
    this.tipIndicators = tips.map(function(t, i) { return i; });

    this.title = "good";
    this.subtitle = "My LoanHealth:";
    this.toggleHomeScreen = function() {
        // todo: something, show the balance, health, etc.
    }

    this.generateCalendarReminder = function() {
        window.open("https://s3.amazonaws.com/scusa-compare-solutions/data/myevents.ics", "_system")
    };

    var remainingPrincipal = initData.principal - (initData.paymentHistory
        .map(function (pay) {
            return pay.principal;
        }).reduce(function (a, b) { return a + b; }));

    this.activeDataSet = function (mode) {

        if (mode == APPMODE.WHATIF)
            return predictPayments({
                principal: remainingPrincipal,
                rate: initData.rate,
                payment: self.monthlyPayment(),
                defaultPayment: initData.payment,
                fee: initData.lateFee,
                strategy: self.selectedStrategy()
            });

        return initData.paymentHistory;
    };

    this.activeChart = function(){
        return this.charts[this.mode()];
    };

    this.netAmountPaid = ko.observable(currency(0));

    // todo: this might be stupid. freezing the object. lol
    var defaultChartOptions = Object.freeze({
        height: Math.floor(window.screen.height * 0.4),
        width: window.screen.width,
        chartArea: {
            left: 25,
            right: 25,
            top: 50,
            width: Math.floor(window.screen.width * 0.9),
            height: Math.floor(window.screen.height * 0.4)
        },
        legend: { position: 'none' },
        backgroundColor: '#fff',
        colors: ['#B44C54', '#C66970', '#EAA9AE']
    });

    this.onSlide = function (sliderEvent) {
        this.monthlyPayment(sliderEvent.value);
    };

    function refreshWhatIfView() {

        var whatIfSet = self.activeDataSet(APPMODE.WHATIF);
        var probableMaturity = moment(last(whatIfSet).date);

        // check this out (its very close, but not quite perfect yet)
        console.log(predictMaturity({
            principal: remainingPrincipal,
            rate: initData.rate,
            payment: self.selectedStrategy() == "Replacing One Payment" ? initData.payment : self.monthlyPayment(),
            replace: self.selectedStrategy() == "Replacing One Payment" && self.monthlyPayment()
        }), 'vs', whatIfSet.length);

        self.paymentYears(getWhatIfYears(probableMaturity));
        self.selectedYear(first(self.paymentYears()));

        // we can calculate the amount gain/loss based on the new strategy vs the normal schedule.
        var normal = predictPayments({
            principal: remainingPrincipal,
            rate: initData.rate,
            payment: initData.payment,
            defaultPayment: initData.payment,
            fee: initData.lateFee,
            strategy: "Normal"
        });

        var normalTotal = getTotalOfPayments(normal);
        var whatIfTotal = getTotalOfPayments(whatIfSet);

        if(whatIfSet.length >= 132 && whatIfTotal < normalTotal)
            whatIfTotal = initData.principal * 2.5;

        var net = normalTotal - whatIfTotal;

        self.whatIfStatus( (net < 0) 
                ? "bad" 
                : (net === 0) 
                    ? "neutral" 
                    : "good");
        
        // todo: call this SAVED.
        self.netAmountPaid(currency(net));

        updateDataTable(self.selectedYear());
    }

    // todo: subscribe to the orientation change??
    this.mode.subscribe(function () {
        self.refreshChart();
    });

    this.refreshChart = function(){
        var chartOptions = {};

        if (this.mode() == APPMODE.SUMMARY) {
            // needs to be the same.
            var w = Math.floor(window.screen.width * 0.85);
            $.extend(chartOptions, defaultChartOptions, {
                chartArea: { width: w, height: w },
                legend: {
                    position: 'bottom',
                    alignment: 'center',
                    textStyle: {
                        fontSize: 11,
                        color: '#a9a9a9'
                    }
                },
                pieHole: 0.4
            });

            self.activeChart().draw(
                'PieChart',
                'chart_div_summary',
                chartOptions,
                summarize(self.activeDataSet())
            );

        } else {

            // both what-if and history share the same settings.
            $.extend(chartOptions, defaultChartOptions, {
                isStacked: true,
                vAxis: { minValue: 0, textStyle: { color: '#a9a9a9' } },
                hAxis: { textStyle: { color: '#a9a9a9' } },
                animation: {
                    duration: 333,
                    easing: 'out',
                }
            });

            if(this.mode() == APPMODE.HISTORY) {
                self.activeChart().draw(
                    'ColumnChart',
                    'chart_div_history',
                    chartOptions
                );

                var ds = self.activeDataSet(APPMODE.HISTORY);

                self.paymentYears(getPaymentYears(ds));
                self.selectedYear(moment(last(ds).date).format("YYYY"));

            }else if (this.mode() == APPMODE.WHATIF) {
                self.activeChart().draw(
                    'ColumnChart',
                    'chart_div_whatif',
                    chartOptions
                );

                refreshWhatIfView();

                window.setTimeout(function () {
                    self.slider.resize();
                }, 10);
            }
        }
    };

    self.loadPaymentDetails = function (e) {
        var id = e.view.params.id;

        for (var i = 0; i < initData.paymentHistory.length; i++) {
            var item = initData.paymentHistory[i];

            if (item.id == id) {
                self.setCurrentPayment(item);
                break;
            }
        }
    };

    this.refreshView = function () {
        if (!self.isViewInitialized) {
            self.isViewInitialized = true;

            ko.applyBindings(self);

            app.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip').bind('select', function (e) {
                switch ($(e.item).index()) {
                    case 0: self.mode(APPMODE.HISTORY); break;
                    case 1: self.mode(APPMODE.SUMMARY); break;
                    case 2: self.mode(APPMODE.WHATIF); break;
                }
            });

            self.slider = $('#payment-slider').kendoSlider({
                increaseButtonTitle: 'Right',
                decreaseButtonTitle: 'Left',
                min: minimumPayment,
                max: initData.payment * 5,
                smallStep: 50,
                largeStep: 100,
                value: healthGraph.monthlyPayment(),
                slide: healthGraph.onSlide.bind(healthGraph)
            }).data('kendoSlider');

            self.slider.wrapper.css('width', '99%');

            self.activeChart().table = paymentDataToArray(initData.paymentHistory);
            self.activeChart().table.unshift(chartHeaders);
            self.refreshChart();
        }
        // todo: reset slider here (and other UI artifacts caused by SPA state changes)
    };

    return this;
}

HealthGraph.prototype.constructor = HealthGraph;