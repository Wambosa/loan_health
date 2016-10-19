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
            vehicle: "2013 FORD FIESTA",
            principle: 15769.30,
            rate: 0.133,
            term: 72,
            payment: 320.83,
            lateFee: 25,
            startDate: "2012-10-11",
            maturityDate: "2018-10-25",
            paymentHistory: [
                {date: "2012-11-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2012-12-25", principle:219.02, interest: 101.81, fee: 20.0},
                {date: "2013-01-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-02-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-03-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-04-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-05-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-06-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-07-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-08-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-09-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-10-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-11-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2013-12-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-01-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-02-25", principle:219.02, interest: 101.81, fee: 20.0},
                {date: "2014-03-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-04-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-05-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-06-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-07-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-08-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-09-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-10-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-11-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2014-12-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-01-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-02-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-03-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-04-25", principle:219.02, interest: 101.81, fee: 20.0},
                {date: "2015-05-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-06-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-07-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-08-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-09-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-10-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-11-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2015-12-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-01-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-02-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-03-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-04-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-05-25", principle:219.02, interest: 101.81, fee: 20.0},
                {date: "2016-06-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-07-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-08-25", principle:219.02, interest: 101.81, fee: 0.0},
                {date: "2016-09-25", principle:219.02, interest: 101.81, fee: 0.0}
            ]
        }
    };

    return {
        getTest: getTest,
        getUserData: function(key, callback){
            callback(db[key]);
        }
    }
}