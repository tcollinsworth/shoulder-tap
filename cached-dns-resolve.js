/* eslint-disable no-plusplus */
import dns from 'dns'
import net from 'net'
import stringify from 'json-stringify-safe'
import LRUCache from 'lru-cache'
import { init as initLogger } from './logging'

const util = require('util')

const dnsResolve = util.promisify(dns.resolve)

export const config = {
  disabled: process.env.SHOULDER_TAP_DNS_DISABLE === 'true',
  dnsTtlMs: process.env.SHOULDER_TAP_DNS_CACHE_TTL_MS || 10000, // when to refresh actively used dns entries (10 sec)
  cacheGraceExpireMultiplier: process.env.SHOULDER_TAP_DNS_CACHE_EXPIRE_MULTIPLIER || 2, // maximum grace to use entry beyond TTL
  dnsIdleTtlMs: process.env.SHOULDER_TAP_DNS_CACHE_IDLE_TTL_MS || 1000 * 60 * 60, // when to remove entry entirely if not being used (1 hour)
  backgroundScanMs: process.env.SHOULDER_TAP_DNS_BACKGROUND_SCAN_MS || 5000, // how frequently to scan for expired TTL and refresh (5 sec)
  dnsCacheSize: process.env.SHOULDER_TAP_DNS_CACHE_SIZE || 100, // maximum number of entries to keep in cache
  // pino logging options
  logging: {
    name: 'st-cache-dns-resolve',
    // enabled: true,
    level: process.env.SHOULDER_TAP_DNS_LOG_LEVEL || 'info', // default 'info' others trace, debug, info, warn, error, and fatal
    // timestamp: true,
    prettyPrint: process.env.NODE_ENV === 'DEBUG' || false,
    useLevelLabels: true,
  },
  cache: undefined,
}

export const cacheConfig = {
  max: config.dnsCacheSize,
  maxAge: (config.dnsTtlMs * config.cacheGraceExpireMultiplier), // grace for refresh
}

export const stats = {
  dnsEntries: 0,
  refreshed: 0,
  hits: 0,
  misses: 0,
  idleExpired: 0,
  errors: 0,
  lastError: 0,
  lastErrorTs: 0,
}

let log
let backgroundRefreshId
let cachePruneId

init()

export function init() {
  log = initLogger(config.logging)

  if (config.cache) return

  config.cache = new LRUCache(cacheConfig)

  startBackgroundRefresh()
  startPeriodicCachePrune()
  cachePruneId = setInterval(() => config.cache.prune(), config.dnsIdleTtlMs)
}

export function startBackgroundRefresh() {
  if (backgroundRefreshId) clearInterval(backgroundRefreshId)
  backgroundRefreshId = setInterval(backgroundRefresh, config.backgroundScanMs)
}

export function startPeriodicCachePrune() {
  if (cachePruneId) clearInterval(cachePruneId)
  cachePruneId = setInterval(() => config.cache.prune(), config.dnsIdleTtlMs)
}

export function getStats() {
  stats.dnsEntries = config.cache.length
  return stats
}

export function getDnsCacheEntries() {
  return config.cache.values()
}

// const dnsEntry = {
//   host: 'www.amazon.com',
//   ips: [
//     '52.54.40.141',
//     '34.205.98.207',
//     '3.82.118.51',
//   ],
//   nextIdx: 0,
//   lastUsedTs: 1555771516581, Date.now()
//   updatedTs: 1555771516581,
// }

export function getLookupFunction() {
  if (config.disabled) return dns.lookup // default

  return async function dnsResolveProxy(hostname, family, cb) {
    let ip
    try {
      if (net.isIP(hostname)) {
        ip = hostname
      } else {
        ip = await getAddress(hostname)
      }
      cb(null, ip)
    } catch (error) {
      cb(error)
    }
  }
}

export async function getAddress(host) {
  let dnsEntry = config.cache.get(host)
  if (dnsEntry) {
    ++stats.hits
    dnsEntry.lastUsedTs = Date.now()
    // eslint-disable-next-line no-plusplus
    const ip = dnsEntry.ips[dnsEntry.nextIdx++ % dnsEntry.ips.length] // round-robin
    config.cache.set(host, dnsEntry)
    return ip
  }
  ++stats.misses
  if (log.isLevelEnabled('debug')) log.debug(`cache miss ${host}`)

  const ips = await dnsResolve(host)
  dnsEntry = {
    host,
    ips,
    nextIdx: 0,
    lastUsedTs: Date.now(),
    updatedTs: Date.now(),
  }
  // eslint-disable-next-line no-plusplus
  const ip = dnsEntry.ips[dnsEntry.nextIdx++ % dnsEntry.ips.length] // round-robin
  config.cache.set(host, dnsEntry)
  return ip
}

let backgroundRefreshing = false
export async function backgroundRefresh() {
  if (backgroundRefreshing) return // don't start again if currently iterating slowly
  backgroundRefreshing = true
  try {
    config.cache.forEach(async (value, key) => {
      try {
        if (value.updatedTs + config.dnsTtlMs > Date.now()) {
          return // continue/skip
        }
        if (value.lastUsedTs + config.dnsIdleTtlMs <= Date.now()) {
          ++stats.idleExpired
          config.cache.del(key)
          return // continue
        }

        const ips = await dnsResolve(value.host)
        value.ips = ips
        value.updatedTs = Date.now()
        config.cache.set(key, value)
        ++stats.refreshed
      } catch (err) {
        // best effort
        recordError(err, `Error backgroundRefresh host: ${key}, ${stringify(value)}, ${err.message}`)
      }
    })
  } catch (err) {
    // best effort
    recordError(err, `Error backgroundRefresh, ${err.message}`)
  } finally {
    backgroundRefreshing = false
  }
}

function recordError(err, errMesg) {
  ++stats.errors
  stats.lastError = err
  stats.lastErrorTs = new Date().toISOString()
  log.error(err, errMesg)
}
/* eslint-enable no-plusplus */
