function getMessage (profile) {
  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'airline_boardingpass',
        'intro_message': `Dein Boardingpass ist da. Wie gewünscht mit Fensterplatz 😊`,
        'locale': 'de_DE',
        'boarding_pass': [
          {
            'passenger_name': `${profile.last_name.toUpperCase()}/${profile.first_name.toUpperCase()}`,
            'pnr_number': 'XER447',
            'travel_class': 'business',
            'seat': '2F',
            'auxiliary_fields': [
              {
                'label': 'Terminal',
                'value': 'T1'
              },
              {
                'label': 'Departure',
                'value': '30OCT 09:55'
              }
            ],
            'secondary_fields': [
              {
                'label': 'Boarding',
                'value': '08:40'
              },
              {
                'label': 'Gate',
                'value': 'D57'
              },
              {
                'label': 'Seat',
                'value': '2F'
              },
              {
                'label': 'Sec.Nr.',
                'value': '003'
              }
            ],
            'logo_image_url': 'https:\/\/www.example.com\/en\/logo.png',
            'header_image_url': 'https:\/\/www.example.com\/en\/fb\/header.png',
            'qr_code': 'M1SMITH\/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
            'above_bar_code_image_url': 'https:\/\/www.example.com\/en\/PLAT.png',
            'flight_info': {
              'flight_number': 'FA446',
              'departure_airport': {
                'airport_code': 'TXL',
                'city': 'Berlin',
                'terminal': 'A',
                'gate': 'A11'
              },
              'arrival_airport': {
                'airport_code': 'CDG',
                'city': 'Paris'
              },
              'flight_schedule': {
                'departure_time': '2016-01-02T09:55',
                'arrival_time': '2016-01-02T12:30'
              }
            }
          }
        ]
      }
    }
  }
}

module.exports = (text, reply, profile, cb) => {
  const message = getMessage(profile)
  reply(message, (err) => {
    if (err) return cb(err)

    console.log(`Set message ${message}`)
    return cb(null)
  })
}

module.exports.getMessage = getMessage
