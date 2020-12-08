# watchdog-prometheus-exporter

A Prometheus exporter for the I.T. Watchdogs WxGoos-1 and WeatherGoose II Climate Monitors

### Metrics

This exporter provides the following metrics:

- Temperature (C)
- Temperature (F)
- Humidity
- Dew Point (C)
- Dew Point (F)
- Airflow
- Light
- Sound
- External Temp (F)
- External Temp (C)
- Metrics from any connected analog devices


### Build instructions for standalone docker image
`cd ~`

`git clone https://github.com/serverwrangler/watchdog-prometheus-exporter.git`


modify the Dockerfile to match your IT watchdog ip address at ENV WATCHDOG_PATH='http://<ip here>/data.xml'

`sudo docker build -t serverwrangler/watchdog-prometheus-exporter -f ~/watchdog-prometheus-exporter/Dockerfile .`

`sudo docker run --publish 8000:8000 --detach --name watchdog-prometheus-exporter serverwrangler/watchdog-prometheus-exporter`


You now should be able to open a browser and go to http://localhost:8000/healthz and get a OK status. 
Then check the metrics at http://localhost:8000/metrics


### Environment Variables

| Variable      | Default      | Required? |
|---------------|--------------|-----------|
| PORT          | 8000         |           |
| HOST          | 0.0.0.0      |           |
| METRICS_PATH  | /metrics     |           |
| HEALTH_PATH   | /healthz     |           |
| WATCHDOG_PATH | {no default} | X         |

The `WATCHDOG_PATH` variable should include the full path to the device's `data.xml`.

- Example: `http://10.0.0.100/data.xml`

### Examples

Example Kubernetes manifests and a Grafana dashboard are provided in this repo.

### Contributors

Special thanks to [@asmith60](https://github.com/asmith60) for help to get this working.
