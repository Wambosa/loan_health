function InteractiveGraph(){}

InteractiveGraph.prototype = {

    isChartReady: false,
    chartObj: null,
    chartType: null,
    divId: null,
    chartOptions: null,
    table: [],
    chartWidth: window.screen.width,
    chartHeight: window.screen.height * .5,

    applyBindings: function(){
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

    update: function(dataTable){
        this.reDraw(dataTable);
    },

    deltaUpdate: function(position, value){
        this.table[position.x][position.y] = value;
        this.reDraw()
    }
};