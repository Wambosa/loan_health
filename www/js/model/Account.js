function Account(initData) {

	var self = this;

	this.mode = ko.observable(APPMODE.HISTORY);

	this.settings = {
		name: initData.name,
		vehicle: initData.vehicle,
		rate: "" + (initData.rate * 100) + " %",
		payment: currency(initData.payment),
		principal: "$"+initData.principal,
		maturityDate: moment(initData.maturityDate).format('MMM Do YYYY')
	};

	this.charts = {};
	this.charts[APPMODE.HISTORY] = new InteractiveGraph();
	this.charts[APPMODE.SUMMARY] = new InteractiveGraph();
	this.charts[APPMODE.WHATIF] = new InteractiveGraph();

	this.setCurrentPayment = function (item) {
		self.currentPaymentDate(item.displayDate);
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
	this.minimumPayment = roundDecimal(initData.payment * .5);
	this.isPaidOff = ko.observable(initData.principal <= 0);
	this.monthlyPayment = ko.observable(initData.payment);
	this.monthlyPayment.subscribe(function (val) {
		if (val < self.minimumPayment)
			self.monthlyPayment(self.minimumPayment);

		self.slider.value(val);
		refreshWhatIfView();
	});

	this.selectedStrategy = ko.observable(STRATEGY.NORMAL);
	this.selectedStrategy.subscribe(function (_) {
		refreshWhatIfView();
	});

	// basically just saves duplication on the swipe code.
	// left to right to swipe left looks counter-intuitive,
	// but it's more analogous to turning a page.
	var swipe = function (e) {
		var offset = 0;

		if (e.direction === 'left') offset = 1;
		else if (e.direction === 'right') offset = -1;

		return offset;
	};

	this.nextTip = function (e) {

		var offset = swipe(e);

		if (offset !== 0) {
			var next = self.tipIndex() + offset;

			if (next > tips.length - 1) next = 0;
			if (next < 0) next = tips.length - 1;

			self.tipIndex(next);
			self.currentTip(tips[next]);
		}
	};

	// add a little randomness into our lives.
	this.tipIndex = ko.observable(rand(0, tips.length));
	this.currentTip = ko.observable(tips[this.tipIndex()]);
	this.tipIndicators = tips.map(function (t, i) { return i; });

	var touches = [];

	this.globTouchEnd = function (e) {
		// as soon as any touch stops,
		// kill all active touches. 
		touches.length = 0;
	};

	this.globTouch = function (e) {
		var minMovement = 50;
		var direction = void 0;
		var t = e.changedTouches[0];
		var veryFirst = first(touches);

		touches.push({
			x: veryFirst && veryFirst.x - t.clientX || t.clientX,
			y: veryFirst && veryFirst.y - t.clientY || t.clientY,
			i: (new Date()).getTime()
		});

		if (touches.length >= 5) {

			if (last(touches).i - first(touches).i < 3000) {

				var cloned = touches.slice(1);
				var m = cloned.map(function (a) { return a.x });
				var hor = m.reduce(function (a, b) { return a - b; });

				if (Math.abs(hor) > minMovement)
					direction = hor > 0 ? 'right' : 'left';
			}

			touches.length = 0;
		}

		if (direction)
			self.historyChartSwipe({ direction: direction });
	};

	this.historyChartSwipe = function (e) {

		// begin: paranoia
		try {
			var offset = swipe(e);

			if (offset !== 0) {
				var next = Number(self.selectedYear()) + offset;
				var firstYear = first(self.paymentYears());
				var lastYear = last(self.paymentYears());

				if (next <= lastYear && next >= firstYear) {
					self.selectedYear(next);
				}
			}
		}
		catch (ex) {
			console.log(ex);
		}
	};

	// todo: this should be more dynamic...
	// I had bigger plans for this.
	this.title = initData.health;
	this.subtitle = "My LoanHealth:";

	this.generateCalendarReminder = function () {
		// todo: this needs to actually be something real.
		window.open("https://s3.amazonaws.com/scusa-compare-solutions/data/myevents.ics", "_system", "location=yes")
	};

	this.remainingPrincipal = roundDecimal(Math.max(0, initData.principal - (initData.paymentHistory
		.map(function (pay) {
			return pay.principal;
		}).reduce(sum))));

	this.activeDataSet = function (mode) {

		if (mode == APPMODE.WHATIF)
			return predictPayments({
				principal: this.remainingPrincipal,
				rate: initData.rate,
				payment: self.monthlyPayment(),
				defaultPayment: initData.payment,
				fee: initData.lateFee,
				strategy: self.selectedStrategy()
			});

		return initData.paymentHistory;
	};

	this.activeChart = function () {
		return this.charts[this.mode()];
	};

	this.netAmountSaved = ko.observable(currency(0));

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
		tooltip: { isHtml: true },
		legend: { position: 'none' },
		backgroundColor: '#fff',
		colors: colors.redTones
	});

	this.onSlide = debounce(function (sliderEvent) {
		this.monthlyPayment(sliderEvent.value);
	}, 200);

	function refreshWhatIfView() {

		var whatIfSet = self.activeDataSet(APPMODE.WHATIF);

		// todo: this is a lazy fix. unhack
		if (whatIfSet.length <= 0) {
			self.whatIfStatus('You Win');
			self.isPaidOff(true);

		} else {

			var probableMaturity = moment(last(whatIfSet).date);

			self.paymentYears(getWhatIfYears(probableMaturity));
			self.selectedYear(first(self.paymentYears()));

			// we can calculate the amount gain/loss based on the new strategy vs the normal schedule.
			var normal = predictPayments({
				principal: self.remainingPrincipal,
				rate: initData.rate,
				payment: initData.payment,
				defaultPayment: initData.payment,
				fee: initData.lateFee,
				strategy: STRATEGY.NORMAL
			});

			var normalTotal = getTotalOfPayments(normal);
			var whatIfTotal = getTotalOfPayments(whatIfSet);

			if (whatIfSet.length >= 132 && whatIfTotal < normalTotal)
				whatIfTotal = initData.principal * 2.5;

			var net = normalTotal - whatIfTotal;

			self.whatIfStatus((net < 0)
				? "bad"
				: (net === 0)
					? "neutral"
					: "good");

			self.netAmountSaved(currency(net));

			updateDataTable(self.selectedYear());
		}
	}

	this.refreshChart = function (e) {
		var chartOptions = {};

		// lions and tigers and bears! oh my!
		if(e)
			self.mode(e.sender.id.split('-')[1]);

		if (self.mode() == APPMODE.SUMMARY) {
			// needs to be the same.
			$.extend(chartOptions, defaultChartOptions, {
				height: Math.floor(window.screen.height * 0.5),
				chartArea: {
					top: 25,
					bottom: 50,
					width: '95%',
					height: '100%'
				},
				legend: 'bottom',
				pieSliceText: 'label',
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
					easing: 'out'
				}
			});

			if (self.mode() == APPMODE.HISTORY) {
				self.activeChart().draw(
					'ColumnChart',
					'chart_div_history',
					chartOptions
				);

				var ds = self.activeDataSet(APPMODE.HISTORY);

				self.paymentYears(getPaymentYears(ds));
				self.selectedYear(moment(last(ds).date).format("YYYY"));

			} else if (self.mode() == APPMODE.WHATIF) {
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

	return this;
}

Account.prototype.constructor = Account;