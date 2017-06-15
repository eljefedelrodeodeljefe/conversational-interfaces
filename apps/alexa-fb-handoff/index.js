const http = require('http')
const path = require('path')
const debug = require('debug')('fbbot')
const express = require('express')
const bodyParser = require('body-parser')
const Bot = require('messenger-bot')
const handleReplies = require('./lib/replies')
const alexa = require('./lib/alexa')
const config = require('./config')
const tunnel = require('./lib/tunnel')

const PORT = 3000

let bot = new Bot({
  token: config.fb.token,
  verify: config.fb.verify_token,
  app_secret: config.fb.app_secret
})

tunnel.connect(() => {
  debug('tunnel running')
})

bot.on('error', (err) => {
  debug(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  debug(payload.message.attachments)

  if (payload.message.attachments && payload.message.attachments[0] && payload.message.attachments[0].type && payload.message.attachments[0].type === 'location') {
    return handleReplies.locations(payload, reply, (err) => {
      if (err) return debug('got error in quickreply coversation', err)

      debug('end of quickreply conversation')
    })
  }

  if (payload.message.quick_reply) {
    return handleReplies.quickReplies(payload, reply, (err) => {
      if (err) return debug('got error in quickreply coversation', err)

      debug('end of quickreply conversation')
    })
  }

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    handleReplies.messages(text, reply, profile, (err) => {
      if (err) return debug('got error in coversation', err)

      debug('end of conversation')
    })
  })
})

bot.on('postback', (payload, reply, actions) => {
  handleReplies.postbacks(payload, reply, actions, (err) => {
    if (err) return debug('got error in postback', err)

    debug('end of postback conversation')
  })
})

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/webhook', (req, res) => {
  return bot._verify(req, res)
})

app.use('/chat_app', express.static(path.join(__dirname, './chat_app')))

app.post('/webhook', (req, res) => {
  bot._handleMessage(req.body)
  res.end(JSON.stringify({status: 'ok'}))
})

app.post('/webhooks/fulfillment/ai', (req, res) => {
  debug('got fulfillment')
  debug(req.body)
  return res.status(200).send()
})

// arn:aws:lambda:eu-west-1:328821723060:function:happy-travel-2
// or
// https://happy-travel.eu.ngrok.io/webhooks/speech/alexa
app.post('/webhooks/speech/alexa', (req, res) => {
  debug('got alexa')
  debug(req.body)
  return alexa.handler(req.body.request, null)
  // return res.status(200).send()
})

app.post('/webhooks/self', (req, res) => {
  debug('got self')
  debug(req.body)
  return res.json({
    status: 'ok'
  })
  // return res.status(200).send()
})

http.createServer(app).listen(PORT, () => {
  debug('Echo bot server running at port 3000.')
})
