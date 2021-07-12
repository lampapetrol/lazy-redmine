# lazy-jira

A simple webapp to rapidly fill jira timetracking by daterange using it's [REST api](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-time-tracking/).

## Build and run

### Using docker

```
docker build -t lazy-jira .
docker run --rm -p 3000:3000 lazy-jira
```

You can now open your browser on http://localhost:3000

### Dev build

#### Initial setup

```sh
cd back && npm install
cd ../front && npm install
```

#### Start dev environment (with hot-reload)

```sh
# backend on port 3000
cd back && npm run dev

# frontend on port 8080
cd front && npm run serve
```

### Configuration

See [VueJS reference](https://cli.vuejs.org/config/).
