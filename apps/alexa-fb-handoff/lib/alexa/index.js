/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"] */
'use strict'

const Alexa = require('alexa-sdk')

const APP_ID = 'amzn1.ask.skill.e41b76b7-49bf-4370-854c-17202734bb08'

let mockdate = new Date()
mockdate.setDate(mockdate.getDate() + 2)
mockdate = `${mockdate.getDate()}.${mockdate.getMonth() + 1}.${mockdate.getFullYear()}`

const languageStrings = {
  'de': {
    translation: {
      FLIGHTS: [
        { from: 'Berlin', to: 'Paris', date: mockdate }
      ],
      SKILL_NAME: 'Weltraumwissen auf Deutsch',
      WELCOME: 'Hallo. Wie kann ich dir mit Flügen weiterhelfen?',
      HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
      HELP_REPROMPT: 'Wie kann ich dir helfen?',
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
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
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
