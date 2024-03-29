function Proxy(httpService){

	function getTest(callback, errorHandler){
		httpService.get(
			"|||appServer|||/get.test",
			{},
			callback,
			errorHandler
		);
	}

	var db = {
		"1234": {
			name: "Oliver Ontime",
			vehicle: "2013 FORD FUSION",
			principal: 15769.30,
			health: "good",
			rate: 0.133,
			term: 72,
			payment: 320.83,
			lateFee: 25,
			startDate: "2012-10-11",
			maturityDate: "2018-10-25",
			status: "Current",
			paymentHistory: [
				{ id: 0, date: "2012-11-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 1, date: "2012-12-25", principal:219.02, interest: 101.81, fee: 20.0},
				{ id: 2, date: "2013-01-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 3, date: "2013-02-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 4, date: "2013-03-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 5, date: "2013-04-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 6, date: "2013-05-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 7, date: "2013-06-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 8, date: "2013-07-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 9, date: "2013-08-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 10, date: "2013-09-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 11, date: "2013-10-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 12, date: "2013-11-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 13, date: "2013-12-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 14, date: "2014-01-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 15, date: "2014-02-25", principal:219.02, interest: 101.81, fee: 20.0},
				{ id: 16, date: "2014-03-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 17, date: "2014-04-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 18, date: "2014-05-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 19, date: "2014-06-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 20, date: "2014-07-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 21, date: "2014-08-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 22, date: "2014-09-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 23, date: "2014-10-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 24, date: "2014-11-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 25, date: "2014-12-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 26, date: "2015-01-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 27, date: "2015-02-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 28, date: "2015-03-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 29, date: "2015-04-25", principal:219.02, interest: 101.81, fee: 20.0},
				{ id: 30, date: "2015-05-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 31, date: "2015-06-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 32, date: "2015-07-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 33, date: "2015-08-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 34, date: "2015-09-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 35, date: "2015-10-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 36, date: "2015-11-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 37, date: "2015-12-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 38, date: "2016-01-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 39, date: "2016-02-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 41, date: "2016-03-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 42, date: "2016-04-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 43, date: "2016-05-25", principal:219.02, interest: 101.81, fee: 20.0},
				{ id: 44, date: "2016-06-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 45, date: "2016-07-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 46, date: "2016-08-25", principal:219.02, interest: 101.81, fee: 0.0},
				{ id: 47, date: "2016-09-25", principal:219.02, interest: 101.81, fee: 0.0}
			]
		},

		"9000": {
			name: "James Bond",
			vehicle: "2013 FORD FIESTA",
			principal: 15769.30,
			rate: 0.133,
			health: "average",
			term: 72,
			payment: 320.83,
			lateFee: 15,
			startDate: "2012-10-11",
			maturityDate: "2018-10-25",
			paymentHistory: [
				{id: 0, date: "2012-11-10", principal: 153.09, interest: 171.91, fee: 0.0},
				{id: 1, date: "2012-12-14", principal: 7.06, interest: 192.94, fee: 0.0},
				{id: 2, date: "2012-12-26", principal: 81.94, interest: 68.06, fee: 0.0},
				{id: 3, date: "2013-01-26", principal: 0, interest: 125, fee: 0.0},
				{id: 4, date: "2013-02-12", principal: 53.51, interest: 146.49, fee: 0.0},
				{id: 5, date: "2013-02-25", principal: 126.70, interest: 73.30, fee: 0.0},

				{id: 6, date: "2013-03-11", principal: 21.71, interest: 78.29, fee: 0.0},
				{id: 7, date: "2013-03-22", principal: 138.58, interest: 61.42, fee: 0.0},
				{id: 8, date: "2013-04-13", principal: 78.25, interest: 121.75, fee: 0.0},
				{id: 9, date: "2013-04-26", principal: 163.92, interest: 66.06, fee: 0.0},
				{id: 10, date: "2013-05-21", principal: 58.41, interest: 141.59, fee: 0.0},
				{id: 11, date: "2013-06-04", principal: 39.89, interest: 75.94, fee: 0.0},
				{id: 12, date: "2013-06-29", principal: 64.76, interest: 135.24, fee: 0.0},
				{id: 13, date: "2013-07-16", principal: 29.27, interest: 91.56, fee: 0},
				{id: 14, date: "2013-07-27", principal: 190.87, interest: 59.13, fee: 0.0},
				{id: 15, date: "2013-09-17", principal: 29.40, interest: 270.60, fee: 0},
				{id: 16, date: "2013-11-16", principal: 0, interest: 200, fee: 0},
				{id: 17, date: "2013-11-29", principal: 18.74, interest: 181.26, fee: 0.0},
				{id: 18, date: "2013-12-12", principal: 70.68, interest: 79.32, fee: 0.0},
				{id: 19, date: "2013-12-20", principal: 77.89, interest: 42.11, fee: 0.0},

				{id: 20, date: "2014-01-11", principal: 84.85, interest: 115.15, fee: 0},
				{id: 21, date: "2014-01-21", principal: 97.97, interest: 52.03, fee: 0.0},
				{id: 22, date: "2014-02-03", principal: 608.63, interest: 67.18, fee: 0.0},
				{id: 23, date: "2014-02-10", principal: 85.38, interest: 34.62, fee: 0.0},
				{id: 24, date: "2014-02-19", principal: 156.60, interest: 44.23, fee: 25},
				{id: 25, date: "2014-03-22", principal: 170.24, interest: 150.59, fee: 0},
				{id: 26, date: "2014-04-21", principal: 176.96, interest: 143.87, fee: 0},
				{id: 27, date: "2014-05-10", principal: 10.11, interest: 89.89, fee: 0},
				{id: 28, date: "2014-05-21", principal: 173.55, interest: 47.28, fee: 0},
				{id: 29, date: "2014-06-24", principal: 157.58, interest: 163.25, fee: 0},
				{id: 30, date: "2014-08-11", principal: 38.09, interest: 211.91, fee: 0},
				{id: 31, date: "2014-08-20", principal: 74.07, interest: 45.93, fee: 0},
				{id: 32, date: "2014-10-14", principal: 0, interest: 200, fee: 0},
				{id: 33, date: "2014-10-21", principal: 112.35, interest: 87.65, fee: 0},
				{id: 34, date: "2014-11-12", principal: 17.95, interest: 99.55, fee: 0},
				{id: 35, date: "2014-11-24", principal: 49.58, interest: 54.22, fee: 0},
				{id: 36, date: "2014-12-08", principal: 49.79, interest: 54.01, fee: 0},
				{id: 37, date: "2014-12-16", principal: 162.78, interest: 44.82, fee: 0},
				{id: 38, date: "2014-12-24", principal: 72.84, interest: 30.96, fee: 0},
				{id: 39, date: "2014-12-30", principal: 289.22, interest: 30.78, fee: 0},
				{id: 40, date: "2015-02-27", principal: 86.97, interest: 253.17, fee: 0},
				{id: 41, date: "2015-04-24", principal: 0, interest: 200, fee: 0},
				{id: 42, date: "2015-05-08", principal: 372.68, interest: 98.15, fee: 0},
				{id: 43, date: "2015-05-22", principal: 413.10, interest: 57.73, fee: 0},
				{id: 44, date: "2015-06-23", principal: 312.86, interest: 127.14, fee: 0},
				{id: 45, date: "2015-07-27", principal: 118.8, interest: 131.2, fee: 0},
				{id: 46, date: "2015-08-03", principal: 245.78, interest: 26.71, fee: 0},

				{id: 47, date: "2015-08-19", principal: 261.21, interest: 59.62, fee: 20},
				{id: 48, date: "2015-09-14", principal: 226.43, interest: 97.32, fee: 0},
				{id: 49, date: "2015-10-10", principal: 228.57, interest: 108.42, fee: 0},
				{id: 50, date: "2015-11-07", principal: 223.8, interest: 113.29, fee: 0},
				{id: 51, date: "2015-12-07", principal: 219.32, interest: 116.84, fee: 0},
				{id: 52, date: "2016-01-04", principal: 228.35, interest: 107.95, fee: 0},
				{id: 53, date: "2016-02-12", principal: 7000, interest: 0, fee: 0},
				{id: 54, date: "2016-02-25", principal: 186.89, interest: 148.94, fee: 0},
				{id: 55, date: "2016-03-11", principal: 311.83, interest: 16.06, fee: 0},
				{id: 56, date: "2016-03-26", principal: 997.57, interest: 6.81, fee: 0},
				{id: 57, date: "2016-04-08", principal: 341.93, interest: 2.05, fee: 0},
				{id: 58, date: "2016-05-02", principal: 0, interest: 0.13, fee: 0}
			]
		},

		"1111": {
			name: "Yames Gond",
			vehicle: "2013 FORD FIESTA",
			principal: 15769.30,
			health: "unhealthy",
			rate: 0.133,
			term: 72,
			payment: 320.83,
			lateFee: 15,
			startDate: "2012-10-11",
			maturityDate: "2018-10-25",
			paymentHistory: [
				{id: 1, date: "2012-11-10", principal: 153.09, interest: 171.91, fee: 0.0},
				{id: 2, date: "2012-12-14", principal: 7.06, interest: 192.94, fee: 0.0},
				{id: 3, date: "2012-12-26", principal: 81.94, interest: 68.06, fee: 0.0},
				{id: 4, date: "2013-01-26", principal: 0, interest: 125, fee: 0.0},
				{id: 5, date: "2013-02-12", principal: 53.51, interest: 146.49, fee: 0.0},
				{id: 6, date: "2013-02-25", principal: 126.70, interest: 73.30, fee: 0.0},

				{id: 7, date: "2013-03-11", principal: 21.71, interest: 78.29, fee: 0.0},
				{id: 8, date: "2013-03-22", principal: 138.58, interest: 61.42, fee: 0.0},
				{id: 9, date: "2013-04-13", principal: 78.25, interest: 121.75, fee: 0.0},
				{id: 10, date: "2013-04-26", principal: 163.92, interest: 66.06, fee: 0.0},
				{id: 11, date: "2013-05-21", principal: 58.41, interest: 141.59, fee: 0.0},
				{id: 12, date: "2013-06-04", principal: 39.89, interest: 75.94, fee: 0.0},
				{id: 13, date: "2013-06-29", principal: 64.76, interest: 135.24, fee: 0.0},
				{id: 14, date: "2013-07-16", principal: 29.27, interest: 91.56, fee: 0},
				{id: 15, date: "2013-07-27", principal: 190.87, interest: 59.13, fee: 0.0},
				{id: 16, date: "2013-09-17", principal: 29.40, interest: 270.60, fee: 0},
				{id: 17, date: "2013-11-16", principal: 0, interest: 200, fee: 0},
				{id: 18, date: "2013-11-29", principal: 18.74, interest: 181.26, fee: 0.0},
				{id: 19, date: "2013-12-12", principal: 70.68, interest: 79.32, fee: 0.0},
				{id: 20, date: "2013-12-20", principal: 77.89, interest: 42.11, fee: 0.0}
			]
		}
	};

	return {
		getTest: getTest,
		getUserData: function(key, callback){

			db[key].paymentHistory.forEach(function(pay){
				pay.displayDate = moment(pay.date).format('MMM Do YYYY');
			});

			callback(db[key]);
		}
	}
}