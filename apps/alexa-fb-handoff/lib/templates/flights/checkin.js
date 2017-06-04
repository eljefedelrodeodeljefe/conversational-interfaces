module.exports = (text, reply, profile, cb) => {
  const message = {
    'text': `Alles klar, ich checke dich ein, sobal der Check-in offen ist. Hast du einen favorisierten 💺Sitzplatz?`,
    'quick_replies': [
      {
        'content_type': 'text',
        'title': 'Fenster',
        'payload': JSON.stringify({
          action: 'checkin_seating',
          value: 'window'
        })
      },
      {
        'content_type': 'text',
        'title': 'Gang',
        'payload': JSON.stringify({
          action: 'checkin_seating',
          value: 'aisle'
        })
      },
      {
        'content_type': 'text',
        'title': 'Neben Mitreisenden',
        'payload': JSON.stringify({
          action: 'checkin_seating',
          value: 'with_companions'
        })
      }
    ]
  }

  reply(message, (err) => {
    if (err) return cb(err)
    return cb(null)
  })
}
