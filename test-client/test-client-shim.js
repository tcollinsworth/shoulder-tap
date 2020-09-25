// for es6 install esm and switch to lines marked es6
// npm i -S esm
// eslint-disable-next-line no-global-assign
require = require('esm')(module/* , options */) // es6

const sendMesg = require('./test-client').default

sendMesg()
