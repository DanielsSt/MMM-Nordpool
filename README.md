# MMM-Nordpool

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Shows chart of electricity prices on Nordpool market for current day.

Before using this module get familiar with [Nordpool Terms and conditions for use of website](https://www.nordpoolgroup.com/en/About-us/terms-and-conditions-for-useofwebsite/ "Nordpool Terms and conditions for use of website").

![](https://raw.githubusercontent.com/DanielsSt/MMM-Nordpool/master/screenshots/screenshot.png)


## Using the module
Run these commands from MagicMirror directory (usually `~/MagicMirror`), to clone the repo and install dependencies
```shell
cd modules
git clone https://github.com/DanielsSt/MMM-Nordpool.git
cd MMM-Nordpool
npm install
```

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-Nordpool',
            header: 'Nordpool',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option    | Description                                                                                                     |
|-----------|-----------------------------------------------------------------------------------------------------------------|
| `area` | Area of interest<br><br>**Type:** `string`. <br>**Default:** `LV`|
| `currency` | Currency to use, minor units (cents) will be displayed <br><br>**Type:** `string` <br>**Default:** `EUR` |
| `updateNordpoolHour` | When to pull data for next day in your local time. See known issues<br><br>**Type:** `int` allowed values: `0-23`.<br>**Default:** `1` |
| `maxRandomUpdateMinute` | This randomizes minute when the data is pulled. Poor attempt to not to accidentally DDoS Nordpool, lol<br><br>**Type:** `int` Suggested `0-60`<br>**Default:** `15` |
| `chartConfig` | Customisation options for the chart, see [Chart.js docs](https://www.chartjs.org/docs/2.9.4/configuration/) for inspiration. Only exceptions are `currentPointColor` and `pointColor` those are introduced by this module, overriding `pointBackgroundColor` will make them useless<br><br>**Type:** `object` More details [here](https://www.chartjs.org/docs/2.9.4/configuration/)<br>**Default:**  *see full config example* |
| `useHourlyAverage` |When true uses 60 minute resolution. When false - 15 minutes <br><br>**Type:** `bool`<br>**Default:**  `false` |

## Full config example

```js
var config = {
    modules: [
        {
            module: 'MMM-Nordpool',
            header: 'Nordpool',
            config: {
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
                useHourlyAverage: false
            }
        }
    ]
}
```

## Known issues
- Nordpool returns data based on `Europe/Oslo` timezone, from 00:00 to 23:00, that's why there is `updateNordpoolHour` config option, for my use case data starts at 01:00 which does not bother me enough to fix that. If it bothers you - PRs are more than welcome ❤️

## Useful resources
- [Nordpool](https://www.nordpoolgroup.com/en/ "Nordpool")
- [MagicMirror²](https://github.com/MichMich/MagicMirror/)

