const sendBookingConfirmation = require('./templates/flights/confirmation')
const sendBoardingPass = require('./templates/flights/boardingpass')
const checkConvenience = require('./templates/flights/convenience')
const checkin = require('./templates/flights/checkin')
const seat = require('./templates/flights/seat')

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
  const isAction = actions[text]

  if (isAction) {
    return isAction(text, reply, profile, cb)
  }

  reply({ text: didNotUnderstand }, (err) => {
    if (err) return cb(err)

    console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
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
    console.log('could not find or parse action')
  }

  if (action && action === 'automatic_checkin') return checkin(payload, reply, actions, cb)

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

  console.log(payload)
  if (payload.action && payload.action === 'checkin_seating') {
    return seat(payload, reply, cb)
  }

  if (payload.action && payload.action === 'preflight_entertainment_choice') {
    return checkConvenience.continuation(payload, reply, cb)
  }
}
