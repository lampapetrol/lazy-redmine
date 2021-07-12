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

function authHeaders(key) {
	return {
		headers: { 'Authorization': 'Basic ' + key?.trim() }
	}
};

app.post('/api/time_entries', (req, res) =>
	httpClient.post('/time_entries.json', {
		"time_entry": {
			"project_id": req.body.project,
			"hours": req.body.hours,
			"activity_id": req.body.activity,
			"comments": req.body.comments,
			"spent_on": req.body.date
		}
	}, authHeaders(req.body.key)).then(response => {
		res.send(response.data)
	}).catch(e => {
		res.sendStatus(e.response.status)
		console.error(e)
	})
)

app.post('/api/time_entries/check', (req, res) =>
	httpClient.get('/time_entries.json?user_id=me&spent_on=' + req.body.date, authHeaders(req.body.key)).then(response => {
		res.send(response.data)
	}).catch(e => {
		res.sendStatus(e.response.status)
		console.error(e)
	})
)

app.post('/api/projects', (req, res) => {
	let url = req.body.offset ? '/rest/api/3/project/search?jql=&maxResults=100&startAt=' + req.body.offset : '/rest/api/3/project/search?jql=&maxResults=100'
	httpClient.get(url, authHeaders(req.body.key)).then(response => {
		response.data.projects = response.data.projects.filter(x => x.status === 1)
		res.send(response.data)
	}).catch(e => {
		res.sendStatus(e.response.status)
		console.error(e)
	})
})

app.post('/api/activities', (req, res) => {
	httpClient.get('/projects/' + req.body.id + '.json?include=time_entry_activities', authHeaders(req.body.key)).then(response => {
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
