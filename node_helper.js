var NodeHelper = require("node_helper");
const dayjs = require("dayjs");
const axios = require("axios");

module.exports = NodeHelper.create({

	socketNotificationReceived: async function(notification, payload) {
		if (notification === "MMM-Nordpool-get-data") {
			this.getHourlyConsumerPrices(payload.area, payload.currency, payload.date, payload.useHourlyAverage);
		}
	},

	getHourlyConsumerPrices: async function (area, currency, date, useHourlyAverage) {
		const prettyResults = {prices: [], hours: [], avgPrice: 0};
		let pricesSum = 0;
        const module = this;
        axios.get("https://dataportal-api.nordpoolgroup.com/api/DayAheadPriceIndices?".concat(
            "date=",  dayjs(date).format("YYYY-MM-DD"),
            "&market=DayAhead",
            "&indexNames=", area.toUpperCase(),
            "&currency=", currency.toUpperCase(),
            "&resolutionInMinutes=", (useHourlyAverage ? 60 : 15).toString(),
        )).then(function(response) {
            if (response.status === 200) {
                let results = response.data.multiIndexEntries;
                for (const item of results) {
                    const date = new Date(item.deliveryStart);
                    const hour = date.getHours()
                        .toString()
                        .padStart(2, '0')
                        .concat(':' + date.getMinutes().toString().padStart(2, '0'));
                    const price = Math.round(item.entryPerArea[area.toUpperCase()] * 100) / 1000

                    console.log(`${hour}\t${price.toFixed(3)} ${currency}/kWh`)

                    prettyResults.prices.push(price);
                    prettyResults.hours.push(hour);
                    pricesSum += price;
                }
                prettyResults.avgPrice = (pricesSum / results.length).toFixed(3);

                module.sendSocketNotification("MMM-Nordpool-get-data", prettyResults);
            } else {
                console.log("Could not load data.", "ERROR_FAILED_DL", response.status);
            }
        }).catch(function (error) {
            console.log("Could not load data!", "ERROR_FAILED_DL", {message: error.message, stack: error.stack});
            throw error;
        });
	},
});
