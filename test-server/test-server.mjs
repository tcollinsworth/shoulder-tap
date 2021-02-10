import { ShoulderTapServer } from '../shoulder-tap-server.mjs'

function listener(rawMessage, remote) {
  let message
  try {
    message = JSON.parse(rawMessage)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    // ignore, best-effort
  }

  const result = {
    message,
    remote,
  }
  // eslint-disable-next-line no-console
  console.log(result)
}

export function startTestServer() {
  const shoulderTapServer = new ShoulderTapServer({
    // eslint-disable-next-line no-console
    cb: () => console.log('UDP Server listening'),
  })
  shoulderTapServer.addListener('testListener1', listener)
}
