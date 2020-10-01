import app from './app'

const port = 1234
const serverAddress = 'localhost'
// const serverAddress = '192.168.1.124'

app.listen(port, () => {
	console.log(`Example app listening at http://${serverAddress}:${port}`)
})
