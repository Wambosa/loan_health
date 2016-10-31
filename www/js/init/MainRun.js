// note: optional debugging web shim
if(!window.cordova && !window.device)
	new AppShim();

StatusBar = null;

accountModel = null;

proxy = new Proxy(new Http());

DEVICE = new Device(function initViewModels(){

	if (StatusBar)
		StatusBar.hide();

	window.app = new kendo.mobile.Application(document.body, {
		layout: "home-page",
		transition: "slide",
		skin: "nova",
		icon: {
			"" : '@Url.Content("~/icon.png")',
			"128x128" : '@Url.Content("~/icon.png")',
			"256x256" : '@Url.Content("~/splash.png")'
		}
	});
});

function initializeView() {
	console.log('init');

	if (!window.isViewInitialized) {
		window.isViewInitialized = true;

		var accountId = document.getElementById("username").value
			|| document.getElementById("password").value;

		proxy.getUserData(accountId || 1111, function(userData){

			accountModel = new Account(userData);

			window.location.href = '/#view/account.html';

			window.setTimeout(function(){

				ko.applyBindings(accountModel);

				document.getElementById('chart_div_history')
					.addEventListener("touchmove", accountModel.globTouch, true);

				document.getElementById('chart_div_whatif')
					.addEventListener("touchmove", accountModel.globTouch, true);

				app.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip').bind('select', function (e) {
					switch ($(e.item).index()) {
						case 0: accountModel.mode(APPMODE.HISTORY); break;
						case 1: accountModel.mode(APPMODE.SUMMARY); break;
						case 2: accountModel.mode(APPMODE.WHATIF); break;
					}
				});

				accountModel.slider = $('#payment-slider').kendoSlider({
					increaseButtonTitle: 'Right',
					decreaseButtonTitle: 'Left',
					min: accountModel.minimumPayment,
					max: roundDecimal(userData.payment * 5),
					smallStep: 50,
					largeStep: 100,
					value: accountModel.monthlyPayment(),
					slide: accountModel.onSlide.bind(accountModel)
				}).data('kendoSlider');

				accountModel.slider.wrapper.css('width', '99%');

				var lastPaymentYear = +moment(last(userData.paymentHistory).date).format("YYYY");

				accountModel.activeChart().table = paymentDataToArray(userData.paymentHistory.filter(yearFilter(lastPaymentYear)));
				accountModel.activeChart().table.unshift(chartHeaders);
				accountModel.refreshChart();

			}, 100);

		});
	}else{
		accountModel.refreshChart();
	}
}