Module.register("MMM-Nordpool", {
	requiresVersion: "2.1.0", // Required version of MagicMirror
	defaults: {
		area: "LV",
		currency: "EUR",
		updateNordpoolHour: 1,
		maxRandomUpdateMinute: 15,
		chartConfig: {
			backgroundColor: "rgba(255,255,255,0.1)",
			borderColor: "rgba(255,255,255,0.7)",
			fill: true,
			lineTension: 0.5,
			pointBorderColor: "black",
			pointColor: "white",
			currentPointColor: "red",
		},
	},
	chartCanvasId: "nordpool_chart_canvas",
	chartRedrawTimeoutId: null,
	nordpoolUpdateTimeoutId: null,
	loaded: false,

	start: function() {
		this.updateDom();
		this.getData();
	},

	getData: function() {
		this.sendSocketNotification("MMM-Nordpool-get-data", this.config);
		this.scheduleNordpoolUpdate();
	},


	scheduleNordpoolUpdate: function() {
		if (this.nordpoolUpdateTimeoutId !== null) {
			clearTimeout(this.nordpoolUpdateTimeoutId)
		}

		const now = new Date();
		const tomorrow = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()+1,
			this.config.updateNordpoolHour,
			Math.floor(Math.random() * this.config.maxRandomUpdateMinute),
		);
		const msTillNext = (tomorrow - now) + 1000; // lets do it 1s after midnight
		let self = this;
		this.nordpoolUpdateTimeoutId = setTimeout(function() {
			self.getData();
		}, msTillNext);
	},

	scheduleChartRedraw: function() {
		if (this.chartRedrawTimeoutId !== null) {
			clearTimeout(this.chartRedrawTimeoutId)
		}

		const now = new Date();
		const nextHour = new Date(now.getFullYear(),now.getMonth(),now.getDate(), now.getHours() + 1);
		const msTillNext = (nextHour - now) + 1000; // lets do it 1s after new hour
		let self = this;
		this.chartRedrawTimeoutId = setTimeout(function() {
			self.updateChart();
		}, msTillNext);
	},

	getDom: function() {
		const wrapper = document.createElement("div");
		const wrapperDataRequest = document.createElement("div");
		const chartCanvas = document.createElement("canvas");
		chartCanvas.id = this.chartCanvasId;
		wrapperDataRequest.appendChild(chartCanvas);
		wrapper.appendChild(wrapperDataRequest);

		return wrapper;
	},

	getScripts: function() {
		return [
			"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js",
		];
	},

	getStyles: function () {
		return [
			"MMM-Nordpool.css",
		];
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
		};
	},

	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-Nordpool-get-data") {
			this.dataResponse = payload;
			this.loaded = true;
			this.updateChart();
		}
	},

	updateChart: function () {
		if (! this.loaded) {
			return;
		}

		const containerId = this.chartCanvasId;
		const config = this.config.chartConfig;

		const module = this;
		const currentHour = (new Date()).getHours().toString().padStart(2, "0").concat(":00");

		const dataset = {
			label: this.config.currency + "/MWh",
			data: this.dataResponse.prices,
			pointBackgroundColor: function(context) {
				const index = context.dataIndex;
				const itemHour = module.dataResponse.hours[index];

				if (currentHour === itemHour) {
					return config.currentPointColor;
				} else {
					return config.pointColor;
				}
			},
		};

		Object.assign(dataset, config);

		new Chart(
			document.getElementById(containerId),
			{
				type: "line",
				data: {
					labels: this.dataResponse.hours,
					datasets: [dataset]
				},
				options: {
					legend: {display: false},
					animation: false,
				}
			});

		this.scheduleChartRedraw();
	}
});
