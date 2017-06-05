const apiai = require('apiai')
const uuid = require('uuid')
const debug = require('debug')('apiai')
const config = require('../config')
const apiaiApp = apiai(config.apiai.token)

exports.handle = (text, reply, cb) => {
  let hasCalled = false
  const apiaiRequest = apiaiApp.textRequest(text, {
    sessionId: uuid.v4()
  })

  apiaiRequest.on('response', (response) => {
    debug(response)

    if (!hasCalled) {
      hasCalled = true
      reply({ text: response.result.fulfillment.speech }, (err) => {
        if (err) return cb(err)

        return cb(null, response)
      })
    }
  })

  apiaiRequest.on('error', (err) => {
    if (!hasCalled) {
      hasCalled = true
      return cb(err)
    }
  })

  apiaiRequest.end()
}
