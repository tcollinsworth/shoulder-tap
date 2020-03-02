

## Requirements

Node 10+

# Usage

## Configuration Options

Configuration options with defaults that can be passed to the constructor.

```javascript
{
  enabled: true, // enable/disable client/server, false disabled
  type: 'udp4', // udp4 or udp6
  reuseAddr: false,
  ipv6Only: false,
  recvBufferSize: undefined,
  sendBufferSize: undefined,
  HOST: '127.0.0.1',
  PORT: 3131,
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
echo -n "hello" >/dev/udp/localhost/3131
```

```console
echo -n "hello" | nc -4u -w0 localhost 3131
```

# More information

See the tests and implementation files.
