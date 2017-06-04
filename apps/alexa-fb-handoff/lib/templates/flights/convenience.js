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

exports.continuation = (payload, reply, cb) => {
  const message = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': 'Netflix - Serien und Filme',
            'image_url': 'https://storage.googleapis.com/des-cluster-bucket/76248820160921034356.jpg',
            'subtitle': 'Lade deine Lieblings-Serie runter und schaue sie auf dem Flug an.',
            // 'default_action': {
            //   'type': 'web_url',
            //   'url': 'https://peterssendreceiveapp.ngrok.io/view?item=103',
            //   'messenger_extensions': true,
            //   'webview_height_ratio': 'tall',
            //   'fallback_url': 'https://peterssendreceiveapp.ngrok.io/'
            // },
            'buttons': [
              {
                'type': 'postback',
                'title': 'Top Auswahl',
                'payload': 'DEVELOPER_DEFINED_PAYLOAD'
              },
              {
                'type': 'postback',
                'title': 'Gesamtes Angebot',
                'payload': 'DEVELOPER_DEFINED_PAYLOAD'
              }
            ]
          },
          {
            'title': 'Magazine',
            'image_url': 'http://via.placeholder.com/350x150',
            'subtitle': 'Eine Auswahl an Magazinen',
            // 'default_action': {
            //   'type': 'web_url',
            //   'url': 'https://peterssendreceiveapp.ngrok.io/view?item=103',
            //   'messenger_extensions': true,
            //   'webview_height_ratio': 'tall',
            //   'fallback_url': 'https://peterssendreceiveapp.ngrok.io/'
            // },
            'buttons': [
              {
                'type': 'postback',
                'title': 'Top Auswahl',
                'payload': 'DEVELOPER_DEFINED_PAYLOAD'
              },
              {
                'type': 'postback',
                'title': 'Gesamtes Angebot',
                'payload': 'DEVELOPER_DEFINED_PAYLOAD'
              }
            ]
          }
        ]
      }
    }
  }

  const quickReply = {
    'text': `Jetzt nicht?`,
    'quick_replies': [
      {
        'content_type': 'text',
        'title': 'Lieber doch später.',
        'payload': JSON.stringify({
          action: 'preflight_entertainment_remind_me_later',
          value: 'maybe_later'
        })
      },
      {
        'content_type': 'text',
        'title': 'Erinnere mich kurz vor dem Flug',
        'payload': JSON.stringify({
          action: 'preflight_entertainment_remind_me_later',
          value: 'before_flight'
        })
      }
    ]
  }

  reply(message, (err) => {
    if (err) return cb(err)

    setTimeout(() => {
      reply(quickReply, (err) => {
        if (err) return cb(err)
        return cb(null)
      })
    }, 3000)
  })
}
