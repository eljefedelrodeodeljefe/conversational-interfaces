exports.ask = (text, reply, profile, cb) => {
  const message = {
    'text': `Möchtest du dir kostenlose Magazine oder Serien für den flug runterladen?`,
    'quick_replies': [
      {
        'content_type': 'text',
        'title': 'Ja gerne',
        'payload': JSON.stringify({
          action: 'preflight_entertainment_choice',
          value: 'yes'
        })
      },
      {
        'content_type': 'text',
        'title': 'Nein Danke',
        'payload': JSON.stringify({
          action: 'preflight_entertainment_choice',
          value: 'no'
        })
      },
      {
        'content_type': 'text',
        'title': 'Zeige ein Beispiel',
        'payload': JSON.stringify({
          action: 'preflight_entertainment_choice',
          value: 'show_examples'
        })
      }
    ]
  }

  reply({ text: '👌 ist gespeichert' }, (err) => {
    if (err) return cb(err)

    reply(message, (err) => {
      if (err) return cb(err)
      return cb(null)
    })
  })
}
