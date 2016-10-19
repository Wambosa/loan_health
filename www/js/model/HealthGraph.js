function HealthGraph(initData){
    var self = this;

    this.mode = ko.observable('history');

    this.table = initData.paymentHistory.slice(-8).map(function(pay){
        return [
            moment(pay.date).format('MMM'),
            pay.principle,
            pay.interest,
            pay.fee
        ];
    });
    this.table.unshift(getTableHeaders());

    this.slider = null;

    this.paymentYears = ko.observableArray(getPaymentYears(initData.paymentHistory));
    this.selectedYear = ko.observable(last(this.paymentYears));

    this.selectedYear.subscribe(function(newYear){

        self.table = paymentDataToArray(self.activeDataSet(self.mode())
            .filter(yearFilter(newYear)));

        self.table.unshift(getTableHeaders());

        self.reDraw();
    });

    this.monthlyPayment = ko.observable(initData.payment);
    this.monthlyPayment.subscribe(function (val) {
        self.slider.value(val);
        refreshWhatIfView();
    });

    this.whatIfStrategies = ko.observableArray(getPaymentStrategies());
    this.selectedStrategy = ko.observable(first(getPaymentStrategies()));
    this.selectedStrategy.subscribe(function(_){
        refreshWhatIfView();
    });

    this.remainingPrinciple = initData.paymentHistory
        .map(function(pay){
            return pay.principle;
        }).reduce(function(a,b){return a+b;});

    this.activeDataSet = function(mode){

        if(mode == 'whatIf')
            return predictPayments({
                principle: self.remainingPrinciple,
                rate: initData.rate,
                payment: self.monthlyPayment(),
                defaultPayment: initData.payment,
                fee: initData.lateFee,
                strategy: self.selectedStrategy(),
                lastDate: moment(last(initData.paymentHistory).date)
            });

        return initData.paymentHistory;
    };

    this.isHistory = ko.pureComputed(function(){return self.mode() == 'history';});
    this.isSummary = ko.pureComputed(function(){return self.mode() == 'summary';});
    this.isWhatIf = ko.pureComputed(function(){return self.mode() == 'whatIf';});

    this.chartWidth = ko.pureComputed(function(){return window.screen.width;});
    this.chartHeight = ko.pureComputed(function(){return window.screen.height * .5;});

    this.historyText = ko.pureComputed(function(){
        var original = "This is a historical view of all the payments made towards your |||vehicle|||. It appears you are |||statusText|||";
        return original.replace('|||vehicle|||', initData.vehicle);
    });

    this.summaryText = ko.pureComputed(function(){
        return "You have completed 21 payments on time and 4 payments were late. Don't let due dates sneak up on you! Tap 'Reminder Opt In' to receive calendar reminders and/or text reminders.";
    });

    this.whatIfText = ko.pureComputed(function () {
        return "in this section you can play with what would happen if you pay more or less";
    });

    this.helpText = ko.observable(this.historyText());

    this.onSlide = function(sliderEvent){
        this.monthlyPayment(sliderEvent.value);
    };

    function refreshWhatIfView(){
        var probableMaturity = moment(last(self.activeDataSet('whatIf')).date);
        self.paymentYears(getWhatIfYears(probableMaturity));
        self.selectedYear(0);
        self.selectedYear(first(self.paymentYears()));
    }

    this.mode.subscribe(function(newMode){

        if(newMode === 'whatIf'){

            self.draw('ColumnChart', self.divId, self.chartOptions);

            refreshWhatIfView();

            window.setTimeout(function(){
                self.slider.resize();
            }, 10);
        }

        if(newMode == 'summary'){

            var chartOptions = {
                pieHole: 0.5,
                title: initData.name + "'s Summary",
                height: self.chartHeight(),
                width: self.chartWidth(),
                chartArea:{left:25,top:50,width:'95%',height:'75%'},
                legend: {position: 'top', maxLines: 2},
                legendTextStyle: { color: '#a9a9a9'},
                backgroundColor: '#f7f7f7',
                colors: ['#79c36a', '#f9a65a', '#f1595f']
            };

            self.draw('PieChart', self.divId, chartOptions, summarize(self.activeDataSet('history')));
        }

        if(newMode == 'history') {
            self.draw('ColumnChart', self.divId, self.chartOptions);

            self.paymentYears(getPaymentYears(self.activeDataSet('history')));
            self.selectedYear(moment(last(self.activeDataSet('history')).date).format("YYYY"));
        }

        self.helpText(self[newMode+'Text']());
    });

    return this;
}

HealthGraph.prototype = Object.create(InteractiveGraph.prototype);
HealthGraph.prototype.constructor = HealthGraph;