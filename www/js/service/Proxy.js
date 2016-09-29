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
            principal: 15769.30,
            rate: 0.133,
            term: 72,
            payment: 320.83,
            startDate: "10-11-12",
            maturityDate: "10-25-18",
            paymentHistory: [
                {date: "11-25-12", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "12-25-12", principal:219.02, interest: 101.81, fee: 20.0},
                {date: "1-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "2-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "3-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "4-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "5-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "6-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "7-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "8-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "9-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "10-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "11-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "12-25-13", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "1-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "2-25-14", principal:219.02, interest: 101.81, fee: 20.0},
                {date: "3-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "4-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "5-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "6-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "7-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "8-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "9-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "10-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "11-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "12-25-14", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "1-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "2-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "3-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "4-25-15", principal:219.02, interest: 101.81, fee: 20.0},
                {date: "5-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "6-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "7-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "8-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "9-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "10-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "11-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "12-25-15", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "1-25-16", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "2-25-16", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "3-25-16", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "4-25-16", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "5-25-16", principal:219.02, interest: 101.81, fee: 20.0},
                {date: "6-25-16", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "7-25-16", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "8-25-16", principal:219.02, interest: 101.81, fee: 0.0},
                {date: "9-25-16", principal:219.02, interest: 101.81, fee: 0.0}
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