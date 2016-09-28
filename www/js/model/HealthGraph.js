function HealthGraph(initData){
    var self = this;

    this.mode = ko.observable('history');

    this.table = [["time", "principal", "interest", "fees"]];
    initData.paymentHistory.slice(-6).forEach(function(pay){
        self.table.push([
            moment(pay.date).format('MMM'),
            pay.principal,
            pay.interest,
            pay.fee
        ]);
    });

    this.slider = null;
    this.monthlyPayment = ko.observable(initData.payment);
    this.monthlyPayment.subscribe(function (val) {
        self.slider.value(val);
        self.deltaUpdate({x:self.table.length-1, y: 1}, val);
    });

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
            window.setTimeout(function(){self.slider.resize();}, 10);
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
        }

        self.helpText(self[newMode+'Text']());
    });

    return this;
}

HealthGraph.prototype = Object.create(InteractiveGraph.prototype);
HealthGraph.prototype.constructor = HealthGraph;