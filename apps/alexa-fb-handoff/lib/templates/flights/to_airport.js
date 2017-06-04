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

exports.continuation = () => {

}
