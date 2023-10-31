var NodeHelper = require("node_helper");
const {Prices} = require("nordpool");

module.exports = NodeHelper.create({

	socketNotificationReceived: async function(notification, payload) {
		if (notification === "MMM-Nordpool-get-data") {
			const results = await this.getHourlyConsumerPrices(payload.area, payload.currency);
			this.sendSocketNotification("MMM-Nordpool-get-data", results);
		}
	},

	getHourlyConsumerPrices: async function (area, currency) {

		const opts = {
			area: area.toUpperCase(),
			currency: currency.toUpperCase(),
		};

		const prettyResults = {prices: [], hours: [], avgPrice: 0};
		let pricesSum = 0;

		const prices = new Prices();
		const results = await prices.hourly(opts);

		for (const item of results) {
			const date = new Date(item.date)
			const hour = date.getHours().toString().padStart(2, '0').concat(':00')
			const price = Math.round(item.value * 100) / 1000

			console.log(`${hour}\t${price.toFixed(3)} ${currency}/kWh`)

			prettyResults.prices.push(price);
			prettyResults.hours.push(hour);
			pricesSum += price;
		}

		prettyResults.avgPrice = (pricesSum / results.length).toFixed(3);
		return prettyResults;
	},
});
