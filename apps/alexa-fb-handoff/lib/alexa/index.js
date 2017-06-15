/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"] */
'use strict'

const Alexa = require('alexa-sdk')
const http = require('https')

const APP_ID = 'amzn1.ask.skill.e41b76b7-49bf-4370-854c-17202734bb08'

function postWebhook (host, payload, cb) {
  let hasCalled = false
  const options = {
    'method': 'POST',
    'hostname': host || 'happy-travel.eu.ngrok.io',
    'port': null,
    'path': '/webhooks/self',
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
    this.emit(':ask', speechOutput, this.t('WELCOME_REPROMT'))
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
    postWebhook(null, payload, (err) => {
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
  'FlightListNextAll': function () {
    const speechOutput = `Dein nächsten Flüge sind:${this.t('FLIGHTS').map((el, index, array) => {
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

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context)
  alexa.APP_ID = APP_ID
    // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings
  alexa.registerHandlers(handlers)
  alexa.execute()
}
