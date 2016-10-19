function first(array){
    return array.slice(0, 1)[0];
}

function last(array){
    return array.slice(-1)[0];
}

function yearFilter(desiredYear){
    return function(pay){
        return +desiredYear == +moment(pay.date).format("YYYY");
    }
}

function daysThisYear(year){
    return daysBetween(year+"-01-01", year+"-12-31");
}

function daysBetween(from, to){
    return Math.floor(Math.abs((+moment(to) - +moment(from))) / 86400000);
}

function getTableHeaders(){
    return ["time", "principle", "interest", "fees"];
}

function getPaymentStrategies(){
    return [
        "Normally Every Month",
        "A Week Early Every Month",
        "A Week Late Every Month",
        "Every Other Month",
        "One Time On Top of Normal",
        "Replacing One Payment"
    ];
}

function paymentDataToArray(payments){
    return payments.map(function(pay){
        return [
            moment(pay.date).format('MMM'),
            pay.principle,
            pay.interest,
            pay.fee
        ];
    });
}

function getPaymentYears(paymentData){

    var years = [];

    paymentData.forEach(function(pay){
        var y = +moment(pay.date).format("YYYY");
        if(years.indexOf(y) === -1)
            years.push(y);
    });

    return years;
}

function getWhatIfYears(maturityDate){
    var years = [];

    var thisYear = +moment().format("YYYY");
    var yearsLeft = +moment(maturityDate).format("YYYY") - thisYear;

    for(var i=0; i <= yearsLeft;i++)
        years.push(+thisYear + i);

    return years;
}

function summarize(paymentHistory){

    var principleTotal = 0;
    var interestTotal = 0;
    var feeTotal = 0;

    paymentHistory.forEach(function(pay){
        principleTotal += pay.principle;
        interestTotal += pay.interest;
        feeTotal += pay.fee;
    });

    return [
        ["area", "totalAmount"],
        ["principle", principleTotal],
        ["interest", interestTotal],
        ["fee", feeTotal]
    ];
}

function predictPayments(options){

    var strategy = options.strategy;

    return {
        "Normally Every Month": normalPayment,
        "A Week Early Every Month": function(){
            options.daysFromDueDate = -7;
            return normalPayment(options);
        },
        "A Week Late Every Month": function(){
            options.daysFromDueDate = 7;
            return normalPayment(options);
        },
        "Every Other Month": everyOtherMonthPayment,
        "One Time On Top of Normal": function(){
            var extraAmount = options.payment;
            options.payment = options.defaultPayment;
            options.principle -= extraAmount;
            return supplementalPayment(
                extraAmount,
                normalPayment(options)
            );
        },
        "Replacing One Payment": function(){
            options.replaceOnce = true;
            return normalPayment(options);
        }

    }[strategy](options);
}

function normalPayment(options){

    var amountLeft = options.principle;
    var rate = options.rate;
    var paymentAmount = options.payment;
    var fromDate = options.lastDate;
    var daysFromDueDate = options.daysFromDueDate || 0;

    var dailyInterestRate = rate/daysThisYear(moment().format("YYYY"));

    var payments = [];

    var i = 0;
    var maxMonths = 72;

    while(amountLeft > 0 && i < maxMonths){

        if(options.replaceOnce && i > 0)
            paymentAmount = options.defaultPayment;

        var thisMonth = moment(fromDate).add(i, 'month');

        var days = daysBetween(thisMonth, moment(fromDate).add(1+i, 'month'));

        var interest = (dailyInterestRate * amountLeft) * (days + daysFromDueDate);

        var towardsPrinciple = Math.max(paymentAmount - interest, 0);
        var towardsInterest = Math.min(paymentAmount, interest);

        if(daysFromDueDate > 0 || paymentAmount < options.defaultPayment)
            var fee = options.fee;

        payments.push({
            date: thisMonth.format("YYYY-MM-DD"),
            principle: towardsPrinciple,
            interest: towardsInterest,
            fee: fee && fee || 0
        });

        i++;
        amountLeft -= towardsPrinciple;
    }

    return payments;
}

function everyOtherMonthPayment(options){

    var skipMonth = false;

    var amountLeft = options.principle;
    var rate = options.rate;
    var paymentAmount = options.payment;
    var fromDate = options.lastDate;
    var daysFromDueDate = options.daysFromDueDate || 0;
    var fee = options.fee;

    var dailyInterestRate = rate/daysThisYear(moment().format("YYYY"));

    var payments = [];

    var i = 0;
    var maxMonths = 72;

    while(amountLeft > 0 && i < maxMonths){

        if(!skipMonth){
            var thisMonth = moment(fromDate).add(i, 'month');

            var days = daysBetween(thisMonth, moment(fromDate).add(1+i, 'month'));

            var interest = (dailyInterestRate * amountLeft) * (days + daysFromDueDate);

            var towardsPrinciple = Math.max(paymentAmount - interest, 0);
            var towardsInterest = Math.min(paymentAmount, interest);

            payments.push({
                date: thisMonth.format("YYYY-MM-DD"),
                principle: towardsPrinciple,
                interest: towardsInterest,
                fee: i === 0 ? 0 : fee
            });

            amountLeft -= towardsPrinciple;
        }

        skipMonth = !skipMonth;
        i++;
    }

    return payments;
}

function supplementalPayment(extraAmount, payments){

    var first = payments[0];

    payments.splice(1, 0, {
        date: moment(first.date).add(1, 'day').format("YYYY-MM-DD"),
        principle: extraAmount,
        interest: 0,
        fee: 0
    });

    return payments;
}