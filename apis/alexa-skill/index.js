const Alexa = require('alexa-sdk')

const handlers = {
  'HelloWorldIntent': function () {
    this.emit(':tell', 'Hello World!')
  }
}

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context, callback)
}
