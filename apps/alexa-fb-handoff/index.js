const http = require('http')
const path = require('path')
const debug = require('debug')('fbbot')
const express = require('express')
const bodyParser = require('body-parser')
const Bot = require('messenger-bot')
const handleReplies = require('./lib/replies')
const config = require('./config')

const PORT = 3000

let bot = new Bot({
  token: config.fb.token,
  verify: config.fb.verify_token,
  app_secret: config.fb.app_secret
})

bot.on('error', (err) => {
  debug(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

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

http.createServer(app).listen(PORT, () => {
  debug('Echo bot server running at port 3000.')
})
