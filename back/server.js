const express = require('express')
const axios = require('axios')
const app = express()
const config = require('config');

const port = 3000

var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(express.static('../front/dist'))

const httpClient = axios.create({
	baseURL: config.get('jiraBaseUrl'),
	timeout: 5000,
	headers: { 'Content-Type': 'application/json' }
})

const authParam = (user, key) => {
	return {
		auth: {
			username: user?.trim(),
			password: key?.trim()
		}
	}
}

app.post('/api/time_entries', (req, res) =>
	httpClient.post('/time_entries.json', {
		"time_entry": {
			"project_id": req.body.project,
			"hours": req.body.hours,
			"activity_id": req.body.activity,
			"comments": req.body.comments,
			"spent_on": req.body.date
		}
	}, authParam(req.body.key)).then(response => {
		res.send(response.data)
	}).catch(e => {
		res.sendStatus(e.response.status)
		console.error(e)
	})
)

app.post('/api/time_entries/check', (req, res) =>
	//httpClient.get('/time_entries.json?user_id=me&spent_on=' + req.body.date, authHeaders(req.body.key)).then(response => {
	httpClient.get('/rest/api/2/issue/PROD-248/worklog', authParam(req.body.user, req.body.key)).then(response => {
		res.send(response.data)
	}).catch(e => {
		res.sendStatus(e.response.status)
		console.error(e)
	})
)

app.post('/api/projects', (req, res) => {
	let url = req.body.offset ? '/rest/api/2/project/search?jql=&maxResults=100&startAt=' + req.body.offset : '/rest/api/2/project/search?jql=&maxResults=100'
	httpClient.get(url, authParam(req.body.user, req.body.key)).then(response => {
		console.log(response)
		//response.data.projects = response.data.projects.filter(x => x.status === 1)
		res.send(response.data)
	}).catch(e => {
		//console.log(e)
		res.sendStatus(e?.response?.status)
		console.error(e)
	})
})

app.post('/api/activities', (req, res) => {
	httpClient.get('/projects/' + req.body.id + '.json?include=time_entry_activities', authParam(req.body.user, req.body.key)).then(response => {
		res.send(response.data)
	}).catch(e => {
		res.sendStatus(e.response.status)
		console.error(e)
	})
})

app.get('/api/jiraBaseUrl', (req, res) =>
	res.send(config.get('jiraBaseUrl'))
)

app.listen(port)
