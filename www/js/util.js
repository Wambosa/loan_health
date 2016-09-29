function getTableHeaders(){
    return ["time", "principal", "interest", "fees"];
}

function paymentDataToArray(payments){
    return payments.map(function(pay){
        return [
            moment(pay.date).format('MMM'),
            pay.principal,
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

    var thisYear = moment().format("YYYY");
    var yearsLeft = moment(maturityDate).format("YYYY") - thisYear;

    for(var i=0; i <= yearsLeft;i++)
        years.push(+thisYear + i);

    return years;
}

function yearFilter(desiredYear){
    return function(pay){
        return desiredYear == moment(pay.date).format("YYYY");
    }
}

function predictPayments(amountLeft, rate, paymentAmount, fromDate){

    var dailyInterestRate = rate/daysThisYear(moment().format("YYYY"));

    var payments = [];

    var i = 0;
    var maxMonths = 96;

    while(amountLeft > 0 && i < maxMonths){

        var thisMonth = moment(fromDate).add(i, 'month');

        var days = daysBetween(thisMonth, moment(fromDate).add(1+i, 'month'));
        var interest = (dailyInterestRate * amountLeft) * days;

        var towardsPrincipal = Math.max(paymentAmount - interest, 0);
        var towardsInterest = Math.min(paymentAmount, interest);

        payments.push({
            date: thisMonth.format("MM-DD-YYYY"),
            principal: towardsPrincipal,
            interest: towardsInterest,
            fee: 0
        });

        i++;
        amountLeft -= towardsPrincipal;
    }

    return payments;
}

function summarize(paymentHistory){

    var principalTotal = 0;
    var interestTotal = 0;
    var feeTotal = 0;

    paymentHistory.forEach(function(pay){
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

function daysThisYear(year){
    return Math.floor((moment("12-31-"+year) - moment("1-1-"+year)) / 86400000);
}

function daysBetween(from, to){
    return Math.floor((moment(to) - moment(from)) / 86400000);
}

function last(array){
    return array.slice(-1)[0];
}

function first(array){
    return array.slice(0, 1)[0];
}