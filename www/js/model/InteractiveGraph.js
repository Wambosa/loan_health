function InteractiveGraph() { }

InteractiveGraph.prototype = {

	isChartReady: false,
	chartObj: null,
	chartType: null,
	divId: null,
	chartOptions: null,
	table: [],

	prepare: function (callback) {
		var self = this;

		function isPrepared() {
			self.isChartReady = true;
			callback();
		}

		google.charts.load('current', { 'packages': ['corechart'] });
		google.charts.setOnLoadCallback(isPrepared);
	},

	draw: function (newChartType, divId, options, dataArray) {
		var self = this;
		var lastChartType = this.chartType;

		var isAnimatable = function () {
			return newChartType === lastChartType;
		};

		this.chartType = newChartType;
		this.divId = divId;
		this.chartOptions = options;

		function _draw() {
			var dataTable = google.visualization.arrayToDataTable(dataArray || self.table);
			self.chartObj = !self.chartObj || !isAnimatable()
				? new google.visualization[self.chartType](document.getElementById(divId))
				: self.chartObj;

			self.chartObj.draw(dataTable, options);
		}

		if (this.isChartReady)
			_draw();
		else
			this.prepare(_draw);
	},

	reDraw: function (dataTable) {
		this.draw(this.chartType, this.divId, this.chartOptions, dataTable || this.table)
	},

	update: function (dataTable) {
		this.reDraw(dataTable);
	}
};