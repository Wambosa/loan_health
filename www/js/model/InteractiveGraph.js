function InteractiveGraph(initData){
    var self = this;

    this.isChartReady = false;
    this.slider = null;
    this.mode = ko.observable('history');

    this.chartObj = null;
    this.chartType = null;
    this.divId = null;
    this.chartOptions = null;
    this.table = [["time", "principal", "interest", "fees"]];

    this.helpText = ko.observable(historyText);
    this.monthlyPayment = ko.observable(initData.payment);

    // todo: range viewing
    initData.paymentHistory.slice(-6).forEach(function(pay){
        self.table.push([pay.date, pay.principal, pay.interest, pay.fee]);
    });

    this.chartWidth = window.screen.width;
    this.chartHeight = window.screen.height * .5;

    this.monthlyPayment.subscribe(function (val) {
        self.slider.value(val);

        self.table[self.table.length-1][1] = val;
        self.reDraw();
    });

    this.mode.subscribe(function(newMode){
        self.modeChange(newMode);
    });

    this.isHistory = ko.pureComputed(function(){
        return self.mode() == 'history';
    });

    this.isSummary = ko.pureComputed(function(){
        return self.mode() == 'summary';
    });

    this.isWhatIf = ko.pureComputed(function(){
        return self.mode() == 'whatIf';
    });

    return this;
}



// todo: find a home
historyText = "This is a historical view of all the payments made towards your |||VehicleName|||. It appears you are |||sentenceStatus||| right on track!";
summaryText = "You are going a great job! Looks like you can benefit from our reminder service below.";
whatIfText = "in this section you can play with what would happen if you pay more or less";


InteractiveGraph.prototype = {

    applyBindings: function(){
        console.log(this);
        ko.applyBindings(this);
        return this;
    },

    prepare: function(callback){

        function isPrepared(){
            this.isChartReady = true;
            callback();
        }

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(isPrepared);
    },

    draw: function(chartType, divId, options, dataArray){
        var self = this;

        var lastChartType = this.chartType;
        function isAnimatable(){
            return chartType === lastChartType;
        }

        this.chartType = chartType;
        this.divId = this.divId || divId;
        this.chartOptions = this.chartOptions || options;

        function _draw(){
            var dataTable = google.visualization.arrayToDataTable(dataArray || self.table);
            self.chartObj = !self.chartObj || !isAnimatable() ? new google.visualization[self.chartType](document.getElementById(divId)) : self.chartObj;
            self.chartObj.draw(dataTable, options);
        }

        if(this.isChartReady)
            _draw();
        else
            this.prepare(_draw);
    },

    reDraw: function(dataTable){
        this.draw(this.chartType, this.divId, this.chartOptions, dataTable || this.table)
    },

    onSlide: function(sliderEvent){
        this.monthlyPayment(sliderEvent.value);
    },

    update: function(dataTable){
        this.reDraw(dataTable);
    },

    deltaUpdate: function(position, value){
        this.table[position.x][position.y] = value;
        this.reDraw()
    },

    modeChange: function(newMode){
        var self = this;

        if(newMode === 'whatIf'){
            this.helpText(whatIfText);
            this.draw('ColumnChart', this.divId, this.chartOptions);
            window.setTimeout(function(){self.slider.resize();}, 10);
        }

        if(newMode == 'summary'){
            this.helpText(summaryText);

            var chartOptions = {
                pieHole: 0.5,
                title: "Summary",
                height: this.chartHeight,
                legend: {position: 'top', maxLines: 2},
                colors: ['#79c36a', '#f9a65a', '#f1595f']
            };

            this.draw('PieChart', this.divId, chartOptions,
                [["area", "totalAmount"], ["principal", 1000],["interest", 300], ["fees", 50]])
        }

        if(newMode == 'history') {
            this.helpText(historyText);
            this.draw('ColumnChart', this.divId, this.chartOptions);
        }
    }
};

InteractiveGraph.prototype.constructor = InteractiveGraph;