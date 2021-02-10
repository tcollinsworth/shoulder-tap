// for es6 install esm and switch to lines marked es6
// npm i -S esm
// eslint-disable-next-line no-global-assign
// require = require('esm')(module/* , options */) // es6

// const startTestServer = require('./test-server').default

import { startTestServer } from './test-server.mjs'

startTestServer()
