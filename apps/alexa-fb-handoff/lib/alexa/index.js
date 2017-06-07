/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"] */
'use strict'

const Alexa = require('alexa-sdk')

const APP_ID = 'amzn1.ask.skill.e41b76b7-49bf-4370-854c-17202734bb08'

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
      GETTING_STARTED: 'Wie kann ich dir mit Flügen weiterhelfen?',
      HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
      HELP_REPROMPT: 'Wie kann ich dir helfen?',
      MY_FEELING: 'Gut.',
      STOP_MESSAGE: 'Auf Wiedersehen!'
    }
  }
}

const handlers = {
  'LaunchRequest': function () {
    this.emit('SmalltalkGreetingsHello')
  },
  'SmalltalkGreetingsHello': function () {
    const speechOutput = this.t('WELCOME')
    this.emit(':tell', speechOutput)
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
    this.emit(':tell', speechOutput)
  },
  'FlightListNextAll': function () {
    const speechOutput = `Dein nächsten Flüge sind:${this.t('FLIGHTS').map((el, index, array) => {
      let and = ''
      if (index === 0 && array.length > 0) and = ' und '

      return `${el.from} nach ${el.to} am ${el.date}${and}`
    })}`
    this.emit(':tell', speechOutput)
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
    var message = 'Say yes to continue, or no to end the game.'
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
