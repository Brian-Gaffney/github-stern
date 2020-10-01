import express from 'express'
import bodyParser from 'body-parser'

import blah from './incoming-web-hook-handler'

const app = express()

// Middleware
app.use(bodyParser.json())

// Request handlers
app.get('/', (req, res) => {
	res.send('Hi there')
})

app.post('/', blah)

export default app
