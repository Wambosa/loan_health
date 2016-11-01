const APPMODE = {
	HISTORY: 'history',
	SUMMARY: 'summary',
	WHATIF: 'whatif'
};

const chartHeaders = [
	"time",
	"principal",
	"interest",
	"fees"
];

const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];

const colors = {
	redTones: ['#B44C54', '#C66970', '#EAA9AE'],
	// todo: I really have a shitty eye for colors...
	// http://colorhunt.co/c/361
	contrast: [ 
		"#5DFF43",
		"#FF9343",
		"#43FFEB"
	]
};
const STRATEGY = {
	NORMAL: "Normal",
	EARLY: "A Week Early",
	LATE: "A Week Late",
	HOPSCOTCH: "Every Other Month",
	SUPPLEMENT: "One Additional",
	REPLACE: "Replace One Payment",
	DEFERMENT: "Two Month Deferment"
};

var strategyDropdown = [];
for (var key in STRATEGY)
	if (STRATEGY.hasOwnProperty(key))
		strategyDropdown.push({ key: key, value: STRATEGY[key] });


const tips = [
	'Paying a few days early each month can have a BIG impact. <a href="#account-whatif">Try out out now!</a>',
	'You can set up payment reminders on your account settings page. <a href="#account-settings">Never miss another payment.</a>',
	'Paying late impacts your credit score <strong>and</strong> the time required to pay off your loan.',
	'The faster you pay off your loan, the more you save in interest.'
];
