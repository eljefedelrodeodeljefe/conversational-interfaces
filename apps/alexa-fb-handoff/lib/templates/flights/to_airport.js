exports.inquire = (payload, reply, actions, cb) => {
  const message = {
    'text': `Da helfe ich gerne - dazu müsste ich nur die Straße wissen bei der du startest`
  }

  const locationMessage = {
    'text': 'Tippe die Straße ein, oder sende mir deinen Standort, falls du gerade in der Nähe von dem Ort bist',
    'quick_replies': [
      {
        'content_type': 'location'
      }
    ]
  }

  reply(message, (err) => {
    if (err) return cb(err)

    setTimeout(() => {
      reply(locationMessage, (err) => {
        if (err) return cb(err)
        return cb(null)
      })
    }, 1500)
  })
}

exports.continuation = (payload, coordinates, reply, cb) => {
  const message = {
    text: `Alles klar:\n\n06:00 Aufstehen\n06:40 Taxi\n07:00 Am Flughafen ankommen\n07:30 Boarding\n07:30 Abheben`
  }

  const continuationMessage = {
    'text': `Brauchst du mehr Zeit Morgens, oder am Flughafen?\nLege einfach deine persönlichen Zeiten fest, dann bekommst du beim nächsten Mal deine favorisierten Zeiten:`,
    'quick_replies': [
      {
        'content_type': 'text',
        'title': 'Mehr Zeit am Morgen',
        'payload': JSON.stringify({
          action: 'to_airport_preferences',
          value: 'more_time_morning'
        })
      },
      {
        'content_type': 'text',
        'title': 'Mehr Zeit am Flughafen',
        'payload': JSON.stringify({
          action: 'to_airport_preferences',
          value: 'more_time_airport'
        })
      },
      {
        'content_type': 'text',
        'title': 'bring mich zur App',
        'payload': JSON.stringify({
          action: 'to_airport_preferences',
          value: 'to_app'
        })
      }
    ]
  }

  reply(message, (err) => {
    if (err) return cb(err)

    setTimeout(() => {
      reply(continuationMessage, (err) => {
        if (err) return cb(err)
        return cb(null)
      })
    }, 2500)
  })
}
