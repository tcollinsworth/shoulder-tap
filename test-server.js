import ShoulderTapServer from './shoulder-tap-server'

function listener(rawMessage, remote) {
  let message
  try {
    message = JSON.parse(rawMessage)
  } catch (err) {
    console.log(err)
    // ignore, best-effort
  }

  const result = {
    message,
    remote,
  }
  console.log(result)
}

export default function startTestServer() {
  const shoulderTapServer = new ShoulderTapServer({
    cb: () => console.log('UDP Server listening'),
  })
  shoulderTapServer.addListener('testListener1', listener)
}
