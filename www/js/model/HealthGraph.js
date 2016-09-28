function HealthGraph(initData){
    var self = this;

    this.mode = ko.observable('history');

    this.table = initData.paymentHistory.slice(-8).map(function(pay){
        return [
            moment(pay.date).format('MMM'),
            pay.principal,
            pay.interest,
            pay.fee
        ];
    });
    this.table.unshift(getTableHeaders());

    this.slider = null;

    this.paymentYears = ko.observableArray(getPaymentYears(initData.paymentHistory));
    this.selectedYear = ko.observable(this.paymentYears.slice(-1)[0]);

    this.selectedYear.subscribe(function(newYear){

        self.table = paymentDataToArray(self.activeDataSet(self.mode())
            .filter(yearFilter(newYear)));

        self.table.unshift(getTableHeaders());

        self.reDraw();
    });

    this.monthlyPayment = ko.observable(initData.payment);
    this.monthlyPayment.subscribe(function (val) {
        self.slider.value(val);
        var probableMaturity = moment(self.activeDataSet(self.mode()).slice(-1)[0].date);
        self.paymentYears(getWhatIfYears(probableMaturity));

        var newMinYear = self.paymentYears.slice(0,1)[0];

        self.selectedYear(0);
        self.selectedYear(newMinYear);
    });

    this.remainingPrincipal = initData.paymentHistory
        .map(function(pay){
            return pay.principal;
        }).reduce(function(a,b){return a+b;});

    this.activeDataSet = function(mode){
        return mode == 'whatIf' && predictPayments(self.remainingPrincipal, initData.rate, self.monthlyPayment(), moment(initData.paymentHistory.slice(-1)[0].date))
        || initData.paymentHistory;
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
        return "You are going a great job! Looks like you can benefit from our reminder service below.";
    });

    this.whatIfText = ko.pureComputed(function () {
        return "in this section you can play with what would happen if you pay more or less";
    });

    this.helpText = ko.observable(this.historyText());

    this.onSlide = function(sliderEvent){
        this.monthlyPayment(sliderEvent.value);
    };

    this.mode.subscribe(function(newMode){

        if(newMode === 'whatIf'){

            self.draw('ColumnChart', self.divId, self.chartOptions);

            var probableMaturity = moment(self.activeDataSet(newMode).slice(-1)[0].date);
            self.paymentYears(getWhatIfYears(probableMaturity));
            self.selectedYear(0);
            self.selectedYear(self.paymentYears.slice(0,1)[0]);

            window.setTimeout(function(){
                self.slider.resize();
            }, 10);
        }

        if(newMode == 'summary'){

            var chartOptions = {
                pieHole: 0.5,
                title: "Summary",
                height: self.chartHeight(),
                width: self.chartWidth(),
                legend: {position: 'top', maxLines: 2},
                colors: ['#79c36a', '#f9a65a', '#f1595f']
            };

            self.draw('PieChart', self.divId, chartOptions,
                [["area", "totalAmount"], ["principal", 1000],["interest", 300], ["fees", 50]])
        }

        if(newMode == 'history') {
            self.draw('ColumnChart', self.divId, self.chartOptions);
            self.paymentYears(getPaymentYears(initData.paymentHistory));
            self.selectedYear(moment(initData.paymentHistory.slice(-1)[0].date).format("YYYY"));
        }

        self.helpText(self[newMode+'Text']());
    });

    return this;
}

HealthGraph.prototype = Object.create(InteractiveGraph.prototype);
HealthGraph.prototype.constructor = HealthGraph;