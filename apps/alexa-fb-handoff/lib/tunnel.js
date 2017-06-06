const EventEmitter = require('events')
const ngrok = require('ngrok')
const config = require('../config')

const ee = new EventEmitter()

ngrok.connect({
  proto: 'http', // http|tcp|tls
  addr: 3000, // port or network address
  // auth: 'user:pwd', // http basic authentication for tunnel
  subdomain: 'happy-travel',
  authtoken: config.ngrok_token, // your authtoken from ngrok.com
  region: 'eu', // one of ngrok regions (us, eu, au, ap), defaults to us,
  configPath: './ngrok.yml' // custom path for ngrok config file
}, (err, url) => {
  console.log(url)
  if (err) {
    throw err
  }
  ee.emit('ready')
})
