/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"] */
'use strict'

const Alexa = require('alexa-sdk')
const http = require('https')

const APP_ID = 'amzn1.ask.skill.e41b76b7-49bf-4370-854c-17202734bb08'

function postWebhook (host, path, payload, cb) {
  let hasCalled = false
  const options = {
    'method': 'POST',
    'hostname': host || 'happy-travel.eu.ngrok.io',
    'port': null,
    'path': `/webhooks/${path || 'self'}`,
    'headers': {
      'content-type': 'application/json',
      'cache-control': 'no-cache'
    }
  }

  const req = http.request(options, (res) => {
    const chunks = []

    res.on('data', (chunk) => {
      chunks.push(chunk)
    })

    res.on('error', (err) => {
      if (hasCalled) return
      hasCalled = true
      return cb(err)
    })

    res.on('end', () => {
      if (hasCalled) return
      hasCalled = true
      let body = Buffer.concat(chunks).toString()

      if (body) {
        try {
          body = JSON.parse(body)
        } catch (e) {
           // ignore
        }
      }

      return cb(null, res.statusCode, body)
    })
  })

  if (payload) {
    req.write(payload)
  }

  req.on('error', (err) => {
    if (hasCalled) return
    hasCalled = true
    return cb(err)
  })

  req.end()
}

function getMockedDate (offset) {
  let mockdate = new Date()
  mockdate.setDate(mockdate.getDate() + offset)
  return `${mockdate.getDate()}.${mockdate.getMonth() + 1}.${mockdate.getFullYear()}`
}

var states = {
  AFTER_FIRST_QESTION: '_AFTER_FIRST_QESTION', // User is trying to guess the number.
  STARTMODE: '_STARTMODE',
  CHECK_IN_MODE: '_CHECK_IN_MODE',
  NOTIFICATIONS: '_NOTIFICATIONS'
}

const languageStrings = {
  'de': {
    translation: {
      FLIGHTS: [
        { from: 'Berlin', to: 'Paris', date: getMockedDate(2) },
        { from: 'Paris', to: 'Berlin', date: getMockedDate(3) }
      ],
      SKILL_NAME: 'Weltraumwissen auf Deutsch',
      ON_CODE: 'Dein Code ist:',
      WELCOME: 'Hallo. Wie kann ich dir mit Flügen weiterhelfen?',
      WELCOME_REPROMT: 'Kann ich dir mit etwas zu Flügen weiterhelfen?',
      GETTING_STARTED: 'Wie kann ich dir mit Flügen weiterhelfen?',
      FLIGHTS_FURTHER_ACTION: 'Soll ich dich für einenn dieser Flüge automatisch einchecken?',
      HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
      HELP_REPROMPT: 'Wie kann ich dir helfen?',
      MY_FEELING: 'Gut.',
      PROMPT_AUTOMATIC_CHECKIN_CONTINUATION: 'Soll ich dich versuchen automatisch zum frühst möglichen Zeitpunkt einzuchecken?',
      REPROMPT: 'Bitte sage das noch einmal.',
      STOP_MESSAGE: 'Auf Wiedersehen!',
      HAPPYTRAVEL_API_ERROR: 'Ich konnte Happy Travel nicht erreichen. Versuche es bitte später noch einmal.',
      CALL_ME: 'Melde dich gerne bei mir...'
    }
  }
}

const handlers = {
  'LaunchRequest': function () {
    this.emit('SmalltalkGreetingsHello')
  },
  'SmalltalkGreetingsHello': function () {
    const speechOutput = this.t('WELCOME')
    // some pre action
    const payload = JSON.stringify({ type: 'new_session' })
    postWebhook(null, null, payload, (err) => {
      if (err) {
        return
      }

      this.handler.state = states.STARTMODE
      this.emit(':ask', speechOutput, this.t('WELCOME_REPROMT'))
    })
  },
  'SmalltalkGreetingsHow_are_you': function () {
    const speechOutput = this.t('MY_FEELING') + ' ' + this.t('GETTING_STARTED')
    this.emit(':tell', speechOutput)
  },
  'FlightEnterBookingcode': function () {
    const codes = []
    for (var el in this.event.request.intent.slots) {
      if (this.event.request.intent.slots.hasOwnProperty(el)) {
        codes.push(this.event.request.intent.slots[el].value)
      }
    }

    const speechOutput = this.t('ON_CODE') + codes.join(', ')
    const payload = JSON.stringify({ name: null, code: codes.join('').toUpperCase() })
    postWebhook(null, null, payload, (err) => {
      if (err) {
        this.emit(':tell', this.t('HAPPYTRAVEL_API_ERROR'))
        return
      }

      this.emit(':ask', speechOutput + ' ' + this.t('PROMPT_AUTOMATIC_CHECKIN_CONTINUATION'), this.t('REPROMPT'))
    })
  },
  'AMAZON.NoIntent': function () {
    this.emit(':tell', 'Ok, bis zum nästen mal')
  },
  'AMAZON.YesIntent': function () {
    this.emit(':tell', 'Ok, danke.')
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE')
    const reprompt = this.t('HELP_MESSAGE')
    this.emit(':ask', speechOutput, reprompt)
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'Unhandled': function () {
    var message = 'Ich habe dich leider nicht verstanden.'
    this.emit(':tell', message)
  }
}

var startHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function () {
    this.emit('NewSession') // Uses the handler in newSessionHandlers
  },
  'FlightListNextAll': function () {
    const speechOutput = `Deine nächsten Flüge sind:${this.t('FLIGHTS').map((el, index, array) => {
      let and = ''
      if (index === 0 && array.length > 0) and = ' und '

      return `${el.from} nach ${el.to} am ${el.date}${and}`
    })}`
    this.emit(':ask', `${speechOutput} ${this.t('FLIGHTS_FURTHER_ACTION')}`, this.t('CALL_ME'))
  },
  'FlightListNextOne': function () {
    const speechOutput = `Dein nächster Flug ist von ${this.t('FLIGHTS')[0].from} nach ${this.t('FLIGHTS')[0].to} am ${this.t('FLIGHTS')[0].date}`
    this.emit(':tell', speechOutput)
  },
  'AMAZON.YesIntent': function () {
    this.attributes['flights'] = this.t('FLIGHTS')
    this.emit(':ask', `Großartig.         Für welchen?`, 'Nenne mir die Position in der Liste')
  },
  'AMAZON.NUMBER': function () {
    this.emit(':tell', 'Nummer')
  },
  'AMAZON.NoIntent': function () {
    this.emit(':tell', 'Okay, melde dich aber gerne bei mir')
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE')
    const reprompt = this.t('HELP_MESSAGE')
    this.emit(':ask', speechOutput, reprompt)
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'Unhandled': function () {
    this.handler.state = states.NOTIFICATIONS
    var message = 'Okay. Ich checke dich für den ersten Flug ein. Soll ich dich bei Facebook automatisch benachrichtigen?'
    this.emit(':ask', message)
  }
})

var notificationHandlers = Alexa.CreateStateHandler(states.NOTIFICATIONS, {
  'NewSession': function () {
    this.emit('NewSession') // Uses the handler in newSessionHandlers
  },
  'AMAZON.YesIntent': function () {
    const payload = JSON.stringify({ user: '1517751254964343' })
    postWebhook(null, 'notifications/facebook', payload, (err) => {
      if (err) {
        return
      }

      this.emit(':tell', 'Okay. Wir sehen uns bei Facebook. Auch da kannst du mit mir reden.')
    })
  },
  'AMAZON.NoIntent': function () {
    this.emit(':tell', 'Okay, melde dich aber gerne bei mir.')
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE')
    const reprompt = this.t('HELP_MESSAGE')
    this.emit(':ask', speechOutput, reprompt)
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest')
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'Unhandled': function () {
    const payload = JSON.stringify({ user: '1517751254964343' })
    postWebhook(null, 'notifications/facebook', payload, (err) => {
      if (err) {
        return
      }

      this.emit(':tell', 'Okay. Wir sehen uns bei Facebook. Auch da kannst du mit mir reden.')
    })
  }
})

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context)
  alexa.APP_ID = APP_ID
    // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings
  alexa.registerHandlers(handlers, startHandlers, notificationHandlers)
  alexa.execute()
}
