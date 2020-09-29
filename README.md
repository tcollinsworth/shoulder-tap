

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

#### Configuration

```javascript
const config = {
  disabled: process.env.SHOULDER_TAP_DNS_DISABLE === 'true',
  dnsTtlMs: process.env.SHOULDER_TAP_DNS_CACHE_TTL_MS || 10000, // when to refresh actively used dns entries (10 sec)
  cacheGraceExpireMultiplier: process.env.SHOULDER_TAP_DNS_CACHE_EXPIRE_MULTIPLIER || 2, // maximum grace to use entry beyond TTL
  dnsIdleTtlMs: process.env.SHOULDER_TAP_DNS_CACHE_IDLE_TTL_MS || 1000 * 60 * 60, // when to remove entry entirely if not being used (1 hour)
  backgroundScanMs: process.env.SHOULDER_TAP_DNS_BACKGROUND_SCAN_MS || 5000, // how frequently to scan for expired TTL and refresh (5 sec)
  dnsCacheSize: process.env.SHOULDER_TAP_DNS_CACHE_SIZE || 100, // maximum number of entries to keep in cache
  // pino logging options
  logging: {
    name: 'shoulder-tap-cache-dns-resolve',
    // enabled: true,
    level: process.env.SHOULDER_TAP_DNS_LOG_LEVEL || 'info', // default 'info' others trace, debug, info, warn, error, and fatal
    // timestamp: true,
    prettyPrint: process.env.NODE_ENV === 'DEBUG' || false,
    useLevelLabels: true,
  },
}
```

#### Statistics

Statistics are available via getStats()

Recommend exposing this through consuming service health statistic/metrics endpoints.

```javascript
const stats = {
  dnsEntries: 0,
  refreshed: 0,
  hits: 0,
  misses: 0,
  idleExpired: 0,
  errors: 0,
  lastError: 0,
  lastErrorTs: 0,
}
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
