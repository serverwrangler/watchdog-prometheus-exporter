const xml = require('xml2js');
const prom = require('prom-client');
const got = require('got');
const express = require('express');

const watchdog_tempF = new prom.Gauge({
  name: 'watchdog_tempF',
  help: 'Temperature'
});

const watchdog_humidity = new prom.Gauge({
  name: 'watchdog_humidity',
  help: 'Relative Humidity'
});

const watchdog_airflow = new prom.Gauge({
  name: 'watchdog_airflow',
  help: 'Airflow'
});

const watchdog_sound = new prom.Gauge({
  name: 'watchdog_sound',
  help: 'Sound'
});

async function getAll() {
  // Fetch XML from device
  const response = await got(process.env.WATCHDOG_PATH);

  // Convert XML to JSON
  const json = await xml.parseStringPromise(response.body);

  return json
}

async function getMetrics() {
  const json = await getAll();

  prom.register.resetMetrics();

  watchdog_tempF.set(Number(json.server.devices[0].device[0].field[1].$.value));
  watchdog_humidity.set(Number(json.server.devices[0].device[0].field[2].$.value));
  watchdog_airflow.set(Number(json.server.devices[0].device[0].field[3].$.value));
  watchdog_sound.set(Number(json.server.devices[0].device[0].field[5].$.value));

  return prom.register.metrics();
}

function main() {
  const app = express();

  app.get(process.env.HEALTH_PATH, (req, res) => res.send({status: 'up'}));

  app.get(process.env.METRICS_PATH, async (req, res) => {
    let metrics;
    try {
      metrics = await getMetrics();
    } catch (e) {
      console.error('Error getting metrics!!!');
      throw e;
    }
    res.send(metrics);
  });

  app.listen(process.env.PORT, process.env.HOST, () => console.log('Server is running!!!'));
}

try {
  main();
} catch (e) {
  console.error('Error during startup!!!');
  console.error(e.message, e.stack);
  process.exit(1);
}