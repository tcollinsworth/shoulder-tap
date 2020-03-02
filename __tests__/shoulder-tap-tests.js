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

function listener(message, remote) {
  result = {
    message,
    remote,
  }
}

test.beforeEach((t) => {
  // console.log(ShoulderTapServer, typeof ShoulderTapServer)
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
  await shoulderTapClient.sendBestEffort('hello world!')
  await delay(100)
  t.is(result.message, 'hello world!')
})
