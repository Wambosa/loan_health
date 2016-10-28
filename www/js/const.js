const APPMODE = {
	HISTORY: 'history',
	SUMMARY: 'summary',
	WHATIF: 'whatIf'
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
}

const paymentStrategies = [
	"Normal",
	"A Week Early Every Month",
	"A Week Late Every Month",
	"Every Other Month",
	"One Time On Top of Normal",
	"Replacing One Payment",
	"Two Month Deferment"
];

const tips = [
	'Tip: Did you know that paying a few days early can have a BIG impact. <a href="#account-whatif">Try out out now!</a>',
	'Tip: You can set up payment reminders on your account settings page. <a href="#account-settings">Never miss another payment.</a>',
	'Tip: Paying late impacts your credit score <strong>and</strong> the time required to pay off your loan.',
	'Tip: The faster you pay off your loan, the more you save.'	
];
