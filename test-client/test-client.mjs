import ShoulderTapClient from '../shoulder-tap-client.mjs'

export function sendMesg() {
  try {
    const client = new ShoulderTapClient()
    client.setErrorListener((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
    })
    client.sendBestEffort(JSON.stringify({ key: 'testKey', value: 'testValue' }))
    setTimeout(() => { process.exit(0) }, 0)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    setTimeout(() => { process.exit(1) }, 0)
  }
}
