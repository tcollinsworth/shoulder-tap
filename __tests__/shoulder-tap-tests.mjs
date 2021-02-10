import ava from 'ava'

import delay from 'delay'

import { ShoulderTapServer, ShoulderTapClient } from '../index.mjs'

const test = ava.serial

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
    // eslint-disable-next-line no-console
    console.log(err)
    // ignore, best-effort
  }

  result = {
    message,
    remote,
  }
  // eslint-disable-next-line no-console
  console.log(result)
}

test.beforeEach((t) => {
  shoulderTapServer = new ShoulderTapServer({
    // eslint-disable-next-line no-console
    cb: () => console.log('UDP Server listening'),
  })
  shoulderTapServer.addListener('testListener1', listener)

  shoulderTapClient = new ShoulderTapClient()
  shoulderTapClient.setErrorListener((err) => {
    // eslint-disable-next-line no-console
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
