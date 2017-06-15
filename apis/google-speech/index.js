const Speech = require('@google-cloud/speech')
// const fs = require('fs')
const record = require('node-record-lpcm16')
const apiai = require('apiai')
const uuid = require('uuid')
const app = apiai('ef5643eed00e419a8e4aac95852378a2')

function streamingMicRecognize (audioSocket) {
  console.log('inited')
  // Instantiates a client
  const speech = Speech({
    project: 'speech-apis-e2e-comparison',
    credentials: require('./gauth.json')
  })

  var request = {
    config: {
      encoding: 'LINEAR16',
      languageCode: 'en-US',
      sampleRateHertz: 16000
    },
    singleUtterance: false,
    interimResults: false
  }

  let recognizeStream
  // Create a recognize stream
  function createStream () {
    recognizeStream = speech.createRecognizeStream(request)
    recognizeStream.on('error', (err) => {
      console.log(err)
      createStream()
    })

    recognizeStream.on('data', (data) => {
      console.log(data)

      const apiAIReq = app.textRequest(data.results, {
        sessionId: uuid.v4()
      })

      apiAIReq.on('response', (response) => {
        console.log(response)
        if (audioSocket) audioSocket.emit('audio-data', response)
      })

      apiAIReq.on('error', (error) => {
        console.log(error)
      })

      apiAIReq.end()
    })

    // Start recording and send the microphone input to the Speech API
    record.start({
      sampleRate: 16000,
      threshold: 0.3
    }).pipe(recognizeStream)
  }

  if (process.env.HAS_AUDIO === 'false') return

  createStream()
}

module.exports = streamingMicRecognize

if (require.main === module) {
  streamingMicRecognize(null)
}
