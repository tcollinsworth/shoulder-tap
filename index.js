// for es6 install esm and switch to lines marked es6
// npm i -S esm
// eslint-disable-next-line no-global-assign
require = require('esm')(module/* , options */) // es6

module.exports = {
  // eslint-disable-next-line global-require
  ShoulderTapClient: require('./shoulder-tap-client').default, // es6
  // eslint-disable-next-line global-require
  ShoulderTapServer: require('./shoulder-tap-server').default, // es6
}
// user the following for es5
// module.exports = require('./dist/shoulder-tap') // es5
