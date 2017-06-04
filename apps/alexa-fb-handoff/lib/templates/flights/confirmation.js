module.exports = (text, reply, profile, cb) => {
  const message = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'image_aspect_ratio': 'square',
        'elements': [
          {
            'title': 'Buchungsbestätigung',
            'image_url': 'https://storage.googleapis.com/des-cluster-bucket/confirmation.png',
            // 'subtitle': 'We\'ve got the right hat for everyone.',
            // 'default_action': {
            //   'type': 'web_url',
            //   'url': 'https://b846f4dd.ngrok.io',
            //   'messenger_extensions': true,
            //   'webview_height_ratio': 'tall',
            //   'fallback_url': 'https://b846f4dd.ngrok.io'
            // },
            // docs: https://developers.facebook.com/docs/messenger-platform/send-api-reference/airline-itinerary-template
            'buttons': [
              {
                'type': 'postback',
                'title': 'Zum Kalendar hinzufügen',
                'payload': JSON.stringify({
                  action: 'add_calendar',
                  profile: profile,
                  flight: 'some flight'
                })
              },
              // {
              //   'type': 'web_url',
              //   'url': 'https://b846f4dd.ngrok.io/chat_app',
              //   'webview_height_ratio': 'compact',
              //   'messenger_extensions': false,
              //   'title': 'Zum Kalenedar hinzufügen'
              // },
              {
                'type': 'postback',
                'title': 'Automatischer Checkin-in',
                'payload': JSON.stringify({
                  action: 'automatic_checkin',
                  profile: profile,
                  flight: 'some flight'
                })
              }
            ]
          }
        ]
      }
    }
    // 'attachment': {
    //   'type': 'template',
    //   'payload': {
    //     'template_type': 'airline_checkin',
    //     'locale': 'de_DE',
    //     'pnr_number': 'XER477',
    //     'flight_info': [
    //       {
    //         'flight_number': 'FA446',
    //         'departure_airport': {
    //           'airport_code': 'TXL',
    //           'city': 'Berlin',
    //           'terminal': 'T4',
    //           'gate': 'G8'
    //         },
    //         'arrival_airport': {
    //           'airport_code': 'CDG',
    //           'city': 'Paris',
    //           'terminal': 'T4',
    //           'gate': 'G8'
    //         },
    //         'flight_schedule': {
    //           'boarding_time': '2016-01-05T08:40',
    //           'departure_time': '2016-01-05T09:55',
    //           'arrival_time': '2016-01-05T12:00'
    //         }
    //       }
    //     ],
    //     // 'checkin_url': 'https:\/\/www.airline.com\/check-in'
    //   }
    // }
  }

  reply({ text: `Hi ${profile.first_name}, deine flyair Buchungsbestätigung ist da.` }, (err) => {
    if (err) return cb(err)

    reply(message, (err) => {
      if (err) return cb(err)

      console.log(`Set message ${message}`)
      return cb(null)
    })
  })
}
