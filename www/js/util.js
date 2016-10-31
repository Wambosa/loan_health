function sum(a, b) { 
	return a + b;
}

function roundDecimal(decimal, hops){
	var n = hops || 2;
	return +(decimal.toFixed(n));
}

function reverse(array) {
	var copy = array.slice(0);

	return copy.reverse();
}

function rand (min, max) {
	var f = Math.random();

	return Math.floor(f * max);
}

function currency(num) {
	// rounding to a specific decimal place.
	var amount = Math.floor(Math.round((num || 0) * 100) / 100);
	return "$ " + amount.toLocaleString("en-US");
}

function first(array) {
	return array.slice(0, 1)[0];
}

function last(array) {
	return array.slice(-1)[0];
}

function yearFilter(desiredYear) {
	return function (pay) {
		return +desiredYear == +moment(pay.date).format("YYYY");
	}
}

// let's just assume it's 365?
function daysThisYear(year) {
	return daysBetween(year + "-01-01", year + "-12-31");
}

function daysBetween(from, to) {
	return Math.floor(Math.abs((+moment(to) - +moment(from))) / 86400000);
}

// RIPPED from underscore.js
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function paymentDateSeed(payments){

	var firstDate = moment(first(payments).date);
	var lastDate = moment(last(payments).date).startOf('month');

	var paymentDict = {};
	var paymentYears = [];

	var monthCount = Math.abs(firstDate.startOf('month').diff(lastDate, 'month'));

	for(var i=0;i<=monthCount;i++){

		var year = firstDate.format('YYYY');
		var month = firstDate.format('MMM');

		if(paymentYears.indexOf(year) === -1)
			paymentYears.push(year);

		if(!paymentDict[year])
			paymentDict[year] = {};

		paymentDict[year][month] = {
			principal: 0,
			interest: 0,
			fee: 0
		};

		firstDate.add(1, 'month');
	}

	return {
		years: paymentYears,
		months: months,
		dict: paymentDict
	};
}

/**
 * Injects empty 0 payments to account for payment gaps,
 * normalizes all payments made in a given month into a single bar.
 *  */
function paymentDataToArray(payments) {

	var dataArr = [];

	var seed = paymentDateSeed(payments);
	var dict = seed.dict;

	payments.forEach(function(pay){
		var year = moment(pay.date).format('YYYY');
		var month = moment(pay.date).format('MMM');

		dict[year][month].principal += pay.principal;
		dict[year][month].interest += pay.interest;
		dict[year][month].fee += pay.fee;
	});

	seed.years.forEach(function(y){
		seed.months.forEach(function(m){
			var p = dict[y][m];
			dataArr.push([
				m,
				p && p.principal || 0,
				p && p.interest || 0,
				p && p.fee || 0
			]);
		});
	});

	return dataArr;
}

function getPaymentYears(paymentData) {

	var years = [];

	paymentData.forEach(function (pay) {
		var y = +moment(pay.date).format("YYYY");
		if (years.indexOf(y) === -1)
			years.push(y);
	});

	return years;
}

function getWhatIfYears(maturityDate) {
	var years = [];

	var thisYear = +moment().format("YYYY");
	var yearsLeft = +moment(maturityDate).format("YYYY") - thisYear;

	for (var i = 0; i <= yearsLeft; i++)
		years.push(+thisYear + i);

	return years;
}

function summarize(paymentHistory) {

	var principalTotal = 0;
	var interestTotal = 0;
	var feeTotal = 0;

	paymentHistory.forEach(function (pay) {
		principalTotal += pay.principal;
		interestTotal += pay.interest;
		feeTotal += pay.fee;
	});

	return [
		["area", "totalAmount"],
		["principal", principalTotal],
		["interest", interestTotal],
		["fee", feeTotal]
	];
}

function predictPayments(options) {

	var strategy = options.strategy;

	return {
		"Normal": getFuturePaymentPlan,
		
		"A Week Early Every Month": function () {
			options.daysFromDueDate = -7;
			return getFuturePaymentPlan(options);
		},

		"A Week Late Every Month": function () {
			options.daysFromDueDate = 7;
			return getFuturePaymentPlan(options);
		},

		"Every Other Month": function() {
			options.increment = 2;
			return getFuturePaymentPlan(options);
		},

		"One Time On Top of Normal": function () {
			var extraAmount = options.payment;
			options.payment = options.defaultPayment;
			options.principal -= extraAmount;

			return supplementalPayment(
				extraAmount,
				getFuturePaymentPlan(options)
			);
		},

		"Replacing One Payment": function () {
			options.replaceOnce = true;
			return getFuturePaymentPlan(options);
		},

		"Two Month Deferment": function() {
			options.defermentMonths = 2;

			return getFuturePaymentPlan(options);
		}

	}[strategy](options);
}

/**
 * Given an array of payment objects, combine the total interest/principal and fees.
 */
function getTotalOfPayments(payments) {
	return payments.map(function(p) {
		return p.interest + p.principal + p.fee;
	}).reduce(sum);
}

/**
 * This function computes the normal payment schedule, or some variation based on the options.
 * 
 * ex: +10 daysFromDueDate would be assessed a late fee and change the schedule.
 * 
 * @param options {Object} 
 * 	@prop fee {Number} flat amount. This does not cover all cases. We know that.
 *  */
function getFuturePaymentPlan(options) {

	var rate = options.rate;
	var amountLeft = options.principal;
	var increment = options.increment || 1;
	var maxMonths = options.maxMonths || 132;
	var paymentAmount = options.payment;
	var isReplaceFirstPayment = options.replaceOnce;
	var daysFromDueDate = options.daysFromDueDate || 0;
	var dailyInterestRate = rate / daysThisYear(moment().format("YYYY"));
	
	// this variable will persist if interest goes unpaid.
	var unpaidInterest = 0;
	var payments = [];

	var i = 0;

	// TODO: TRIPP?
	// 6 months at a different (something) amount, no fees.
	
	// todo: I think there might be some numeric precision issues going on here.
	// we might want to address those at some point.
	while (amountLeft > 0 && i < maxMonths) {

		var paymentDeferred = options.defermentMonths > 0 
							&& options.defermentMonths > i;
		
		// properly reset the payment amount variable on each iteration.
		if (options.defermentMonths > 0) {
			paymentAmount = options.payment;
		}

		if (paymentDeferred) {
			paymentAmount = 0;
		}

		// optional: reset the payment back to normal after first payment
		if (isReplaceFirstPayment && i > 0)
			paymentAmount = options.defaultPayment;

		var thisMonth = moment().add(i, 'month');
		var lastMonth = moment().add(i - increment, 'month');
		var days = daysBetween(thisMonth, lastMonth);

		// plus any unpaid interest. interest actually accumulates fam.
		var interest = (dailyInterestRate * amountLeft) * (days + daysFromDueDate) + unpaidInterest; 
		var towardsPrincipal = Math.min(amountLeft, Math.max(paymentAmount - interest, 0));
		var towardsInterest = Math.min(paymentAmount, interest);

		// if we pay late OR if we pay less than owed. incur late fee
		// technically the fee is assessed at the END
		if (daysFromDueDate > 0 || paymentAmount < options.defaultPayment)
			var fee = options.fee;

		// ignore fee if this is the last payment OR a deferred payment.
		if (amountLeft < paymentAmount || paymentDeferred)
			fee = 0;

		unpaidInterest = interest - towardsInterest;

		// and then this is sorta wonky... maybe we just leave fees out.
		// otherwise we have to KNOW if they're going to be 'current'...
		payments.push({
			date: thisMonth.format("YYYY-MM-DD"),
			principal: towardsPrincipal,
			interest: towardsInterest,
			fee: fee && fee || 0
		});

		i += increment;
		amountLeft -= towardsPrincipal;
	}

	return payments;
}

function predictMaturity(options) {

	// console.log(options);

	var rate = options.rate;
	var amountLeft = options.principal;
	var paymentAmount = options.payment;
	var increment = options.increment || 1;
	var maxMonths = options.maxMonths || 132;
	var replace = options.replaceOnce || 0;
	var supplement = options.supplement || 0;
	var daysFromDueDate = options.daysFromDueDate || 0;
	var dailyInterestRate = rate / daysThisYear(moment().format("YYYY"));

	//todo: prediction needs to attempt loose day guess based on principal

	//half the max payment = 802
	var R = 13.3 / 1200;
	var months = 72;
	var D = 2.5 * ( R + ( R / (Math.pow(1 + R, -months) -1 ) ) * 15769.30);

	var accuracy =  .97 + ( ( (paymentAmount - D) / (D*2)) * .07);

	var paymentCount = (
	( ( amountLeft + (((dailyInterestRate * amountLeft) * ((31*increment) + daysFromDueDate)) * amountLeft/paymentAmount) ) * accuracy)
		- supplement
		- (replace ? replace - paymentAmount : 0)
	)
	/ paymentAmount;

	return {
		isFeasible: paymentCount <= maxMonths,
		paymentCount: Math.round(paymentCount),
		maturityDate: moment().add(paymentCount, 'month').format("YYYY-MM-DD")
	};
}

function supplementalPayment(extraAmount, payments) {

	var first = payments[0];

	payments.splice(1, 0, {
		date: moment(first.date).add(1, 'day').format("YYYY-MM-DD"),
		principal: extraAmount,
		interest: 0,
		fee: 0
	});

	return payments;
}