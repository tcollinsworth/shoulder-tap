import dgram from 'dgram'

export default class ShoulderTapServer {
  constructor(config = {}) {
    this.PORT = config.PORT || 3131
    this.HOST = config.HOST || '127.0.0.1'
    this.type = config.type || 'udp4'
    this.server = dgram.createSocket(this.type)
    this.cb = config.cb || undefined
    this.listeners = {}

    this.server.on('listening', () => {
      this.address = this.server.address()
      if (this.cb) this.cb()
    })

    this.server.on('message', (message, remote) => {
      // console.log(`${remote.address}:${remote.port} - ${message}`)
      Object.keys(this.listeners).forEach((key) => {
        // TODO async, try/catch ???
        // console.log('event', key, message.toString('utf8'))
        this.listeners[key](message.toString('utf8'), remote)
      })
    })

    this.server.bind(this.PORT, this.HOST)
  }

  addListener(key, func) {
    this.listeners[key] = func
  }

  removeListener(key) {
    delete this.listeners[key]
  }
}
