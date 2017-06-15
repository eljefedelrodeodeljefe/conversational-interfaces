const ConversationV1 = require('watson-developer-cloud/conversation/v1')
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1')
const record = require('node-record-lpcm16')

const speech_to_text = new SpeechToTextV1({
  username: '',
  password: '',
  url: 'https://stream-fra.watsonplatform.net/speech-to-text/api'
})

const conversation = new ConversationV1({
  username: '',
  password: '',
  version_date: ConversationV1.VERSION_DATE_2017_04_21,
  url: 'https://gateway-fra.watsonplatform.net/conversation/api/'
})

record.start({
  sampleRate: 16000,
  threshold: 0.3
}).pipe(speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=16000' }).on('data', (d) => {
  conversation.message({
    input: { text: d.toString() },
    workspace_id: ''
  }, (err, response) => {
    if (err) {
      console.error(err)
    } else {
      console.log(JSON.stringify(response, null, 2))
    }
  })
}))
