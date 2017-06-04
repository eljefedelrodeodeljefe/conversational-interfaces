module.exports = (payload, reply, cb) => {
  const message = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'button',
        'text': 'Kann ich mit was anderem weiterhelfen?',
        'buttons': [
          {
            'type': 'postback',
            'title': '🕒 Wann muss ich los?',
            'payload': JSON.stringify({
              action: 'to_airport'
            })
          },
          {
            'type': 'postback',
            'title': '🚖 Transport zum Flughafen',
            'payload': 'USER_DEFINED_PAYLOAD'
          },
          {
            'type': 'postback',
            'title': '⛅ Wetter in Paris',
            'payload': 'USER_DEFINED_PAYLOAD'
          }
        ]
      }
    }
  }
  reply({ text: 'Du kannst jederzeit das Mediaangebot sehen indem du mich nach Sachen fragst wie\n\n* Magazine\n* Filme\n* Entertainment' }, (err) => {
    if (err) return cb(err)

    setTimeout(() => {
      reply(message, (err) => {
        if (err) return cb(err)
        return cb(null)
      })
    }, 3000)
  })
}
