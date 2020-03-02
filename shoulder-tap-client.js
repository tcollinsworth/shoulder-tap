import dgram from 'dgram'

export default class ShoulderTapCient {
  constructor(config = {}) {
    this.PORT = config.PORT || 3131
    this.HOST = config.host || '127.0.0.1'
    this.type = config.type || 'udp4'
    this.client = dgram.createSocket(this.type)
  }

  setErrorListener(func) {
    this.errorListener = func
  }

  clearErrorListener() {
    delete this.errorListener
  }

  async sendBestEffort(message) {
    const mesg = Buffer.from(message, 'utf8')

    try {
      await new Promise((resolve, reject) => {
        this.client.send(mesg, 0, mesg.length, this.PORT, this.HOST, (error, bytes) => {
          if (error) {
            return reject(error)
          }
          return resolve(bytes)
        })
      })
    } catch (err) {
      if (this.errorListener) this.errorListener(err)
    }
  }
}
