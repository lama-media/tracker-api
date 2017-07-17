var express = require('express')
var app = express()
var mysql = require('mysql')
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var connection = mysql.createConnection({
  host     : process.env.DB_HOST || '127.0.0.1',
  user     : process.env.DB_USERNAME || 'root',
  password : process.env.DB_PASSWORD || '',
  database : process.env.DB_DATABASE || 'tracker'
})

connection.connect(function(error){
	if (!!error) {
		console.log('Error')
	} else {
		console.log('Connected')
	}
})

app.get('/', function(req, res){
	connection.query("SELECT displayed FROM projects", function(error, rows, fields){
		if (!!error) {
			console.log('Error in the query')
		} else {
			let contentTable = []
			for (let i = 0; i < rows.length; i++) {
				let newObject = {name: rows[i].displayed}
				contentTable.push(newObject)
			}
			res.send(contentTable)
		}
	})
})

app.get('/lastProject', function(req, res){
	connection.query("SELECT * FROM times ORDER BY id DESC LIMIT 1", function(error, rows, fields){
		if (!!error) {
			console.log('Error in the query')
		} else {
			if (rows.length > 0) {
				let trackedData = [rows[0].project, rows[0].beginning, rows[0].end]
				res.send(trackedData)
			} else {
				res.send([])
			}
		}
	})
})

app.post('/start', function(req, res){
	let proj = req.body.project,
		begin = req.body.beginning
	connection.query("INSERT INTO times (project, beginning) VALUES ('" + proj + "','" + begin + "')", function(error, rows, fields){
		if(!!error) {
			console.log('Error in the query')
		} else {
			res.send('Query received')
		}
	})
})

app.put('/stop', function(req, res){
	let end = req.body.end,
		task = req.body.task
	connection.query("UPDATE times SET end = '" + end + "', task = '" + task + "' WHERE task = '' ORDER BY id DESC LIMIT 1", function(error, rows, fields){
		if(!!error) {
			console.log('Error in the query')
		} else {
			res.send('Query received')
		}
	})
})

app.listen(process.env.PORT || 3000)
