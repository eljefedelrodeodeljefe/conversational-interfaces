module.exports = (payload, reply, cb) => {
  let seat
  switch (payload.value) {
    case 'window':
      seat = 'Festerplatz'
      break
    case 'aisle':
      seat = 'Gangplatz'
      break
    case 'with_companion':
      seat = 'mit einem Mitreisenden'
      break
    default:

  }
  const message = {
    'text': `Alles klar - ${seat || ''} ist vermerkt.`
  }

  reply(message, (err) => {
    if (err) return cb(err)
    return cb(null)
  })
}
