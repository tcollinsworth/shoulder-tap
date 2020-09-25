import { serial as test } from 'ava'

import delay from 'delay'

import { ShoulderTapServer, ShoulderTapClient } from '../index'

let shoulderTapServer
let shoulderTapClient
let result

// remote = {
//   address: '127.0.0.1',
//   family: 'IPv4',
//   port: 37125,
//   size: 12,
// }

function listener(rawMessage, remote) {
  let message
  try {
    message = JSON.parse(rawMessage)
  } catch (err) {
    console.log(err)
    // ignore, best-effort
  }

  result = {
    message,
    remote,
  }
  console.log(result)
}

test.beforeEach((t) => {
  shoulderTapServer = new ShoulderTapServer({
    cb: () => console.log('UDP Server listening'),
  })
  shoulderTapServer.addListener('testListener1', listener)

  shoulderTapClient = new ShoulderTapClient()
  shoulderTapClient.setErrorListener((err) => {
    console.log(err)
    t.fail()
  })
})

test('start server', async (t) => {
  const mesg = {
    key: 'key',
    value: 'hello world!',
  }
  await shoulderTapClient.sendBestEffort(JSON.stringify(mesg))
  await delay(100)
  t.is(result.message.key, 'key')
  t.is(result.message.value, 'hello world!')
})
