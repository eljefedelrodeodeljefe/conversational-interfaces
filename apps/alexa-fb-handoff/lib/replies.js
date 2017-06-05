const sendBookingConfirmation = require('./templates/flights/confirmation')
const sendBoardingPass = require('./templates/flights/boardingpass')
const checkConvenience = require('./templates/flights/convenience')
const endFlightConvo = require('./templates/flights/end_conversation')
const toAirport = require('./templates/flights/to_airport')
const checkin = require('./templates/flights/checkin')
const seat = require('./templates/flights/seat')
const conversation = require('./conversation')
const debug = require('debug')('fbbot')

const actions = {
  'demodays': (text, reply, profile, cb) => {
    return sendBookingConfirmation(text, reply, profile, cb)
  },
  'demoweek': (text, reply, profile, cb) => {
    return sendBoardingPass(text, reply, profile, cb)
  },
  'demobeforeflight': (text, reply, profile, cb) => {
    return checkConvenience.ask(text, reply, profile, cb)
  }
}

const didNotUnderstand = 'ich habe dich nicht verstanden'

exports.messages = (text, reply, profile, cb) => {
  const isAction = actions[text.toLowerCase().trim()]

  if (isAction) {
    return isAction(text, reply, profile, cb)
  }

  debug(text)

  conversation.handle(text, reply, (err) => {
    if (err) return cb(err)

    return cb(null)
  })
}

exports.postbacks = (payload, reply, actions, cb) => {
  let action
  try {
    if (payload && payload.postback && payload.postback.payload) {
      action = JSON.parse(payload.postback.payload).action
    }
  } catch (e) {
    debug('could not find or parse action')
  }

  debug(payload)

  if (action && action === 'automatic_checkin') return checkin(payload, reply, actions, cb)

  if (action && action === 'to_airport') return toAirport.inquire(payload, reply, actions, cb)

  if (action && action === 'add_calendar') {
    reply({ text: 'Das Event wird von unserer App automatisch hinzugefügt' }, (err, info) => {
      if (err) return cb(err)

      return cb(null, info)
    })
  }
}

exports.quickReplies = (payload, reply, cb) => {
  try {
    payload = JSON.parse(payload.message.quick_reply.payload)
  } catch (e) {
    return cb(new Error('Error parsing pyload'))
  }

  debug(payload)

  if (payload.action && payload.action === 'checkin_seating') {
    return seat(payload, reply, cb)
  }

  if (payload.action && payload.action === 'preflight_entertainment_choice') {
    return checkConvenience.continuation(payload, reply, cb)
  }

  if (payload.action && payload.action === 'preflight_entertainment_remind_me_later') {
    return endFlightConvo(payload, reply, cb)
  }
}

exports.locations = (payload, reply, cb) => {
  if (payload.message.attachments[0].payload.coordinates) {
    return toAirport.continuation(payload, payload.message.attachments[0].payload.coordinates, reply, cb)
  }
}
