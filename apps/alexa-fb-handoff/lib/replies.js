const getFromTemplate = require('./templates')
const sendBookingConfirmation = require('./templates/flights/confirmation')

const actions = {
  'demodays': (text, reply, profile, cb) => {
    return sendBookingConfirmation(text, reply, profile, cb)
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

  if (action && action === 'automatic_checkin') {
    reply({ text: 'Wir checken dich autoamtisch für diesen Flug ein.' }, (err, info) => {
      if (err) return cb(err)

      return cb(null, info)
    })
  }

  if (action && action === 'add_calendar') {
    reply({ text: 'Das Event wird von unserer App automatisch hinzugefügt' }, (err, info) => {
      if (err) return cb(err)

      return cb(null, info)
    })
  }
}
