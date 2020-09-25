

## Requirements

Node 10+

# Usage

## Configuration Options

Configuration options with defaults that can be passed to the constructor.

[options](https://nodejs.org/api/dgram.html#dgram_dgram_createsocket_options_callback)


### Server

```javascript
import ShoulderTapServer from 'shoulder-tap'

const shoulderTapServer = new ShoulderTapServer({
  type: 'udp4', // udp4 or udp6
  HOST: '127.0.0.1', // bind address
  PORT: 3131, // bind port
})

shoulderTapServer.addListener(key, func)
shoulderTapServer.removeListener(key)
```

### Client

```javascript
import ShoulderTapClient from 'shoulder-tap'

const shoulderTapClient = new ShoulderTapClient({
  type: 'udp4', // udp4 or udp6
  HOST: '127.0.0.1', // destination address
  PORT: 3131, // destination port
})

shoulderTapClient.setErrorListener((err) => {
  log.error(err)
})

shoulderTapClient.sendBestEffort(JSON.stringify({ key: 'testKey', value: 'testValue' }))
```

## Getting started

```console
npm i -S shoulder-tap
```

# Testing

## Command line

### Ubuntu

```console
npm run testServer
```

```console
npm run testClient
```

OR

```console
echo -n "{\"key\":\"hello\"}" >/dev/udp/localhost/3131
```

OR

```console
echo -n "{\"key\":\"hello\"}" | nc -4u -w0 localhost 3131
```

# More information

See the tests and implementation files.
