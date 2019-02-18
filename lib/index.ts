import { config as dotenvConfig } from 'dotenv'
import { get, merge, omit, set, toPlainObject } from 'lodash'
import { dirname, join } from 'path'
import { isString } from 'util'

// Load from `.env.` file
dotenvConfig()

interface IConfigOptions {
  baseFilename?: string
  env?: string
  configRoot?: string
}

/**
 * The environment-specific config loader.
 *
 * It loads the `.env` file first, then loads `default.js`. From there, it will load the config
 * file named after the current environment (e.g. `development.js`), and deep merge that into
 * `default.js`
 *
 * If there is a `*.local.js` file (e.g. `development.local.js`), it will be used for local
 * machine specific config.
 *
 * All config settings can be accessed directly off of the Config object. There are also helper
 * methods to safely access and set config settings that are deeply nested.
 *
 * @example
 * let config = new Config()
 * // {}
 *
 * config.set('a.b.c', 'd')
 * // {
 * //   a: {
 * //     b: {
 * //       c: 'd'
 * //     }
 * //   }
 * // }
 *
 * config.get('a.b.c')
 * // 'd'
 *
 * config.a.b.c
 * // 'd'
 *
 * config.get('doesnt.exist')
 * // undefined
 *
 * config.doesnt.exist
 * // TypeError: Cannot read property 'exist' of undefined
 */
export default class Config {
  /**
   * Create a new Config object by loading the configuration from a directory of
   * environment-specific config files
   *
   * @example
   * Config.load(path.join('..', 'config', 'environments'))
   */
  public static load(opts: IConfigOptions | string = {}) {
    if (isString(opts)) {
      opts = { configRoot: opts }
    }

    const baseFilename = opts.baseFilename || 'default'
    const env = opts.env || process.env.NODE_ENV || 'development'
    const configRoot = opts.configRoot || parentPath()

    const defaultConfig = safeRequire(join(configRoot, baseFilename))
    const envConfig = safeRequire(join(configRoot, env))
    const localConfig = safeRequire(join(configRoot, env + '.local'))

    return new Config(merge({}, defaultConfig, envConfig, localConfig, { env }))
  }

  [key: string]: any
  public env?: string

  constructor(config: Config | object = {}) {
    merge(this, config)
  }

  /**
   * Helper method to get a config value via a key-path. Allows safely accessing
   * nested values that may not be defined.
   *
   * @example
   * config.get('appName')
   * // is the equivalent of:
   * // config.appName
   *
   * config.get('logging.json')
   * // is the equivalent of:
   * // config.logging && config.logging.json
   */
  public get(keyPath: string) {
    return get(this, keyPath)
  }

  /**
   * Helper method to set a config value by key-path.
   *
   * @example
   * config.set('appName', 'Hello')
   * // is the equivalent of:
   * // config.appName = 'Hello
   *
   * config.set('logging.json', 2)
   * // is the equivalent of:
   * // Object.assign(config.logging, { json: 2 })
   */
  public set(keyPath: string, value: any) {
    return set(this, keyPath, value)
  }

  /**
   * Convert the Config object to a Plain Javascript Object
   *
   * This method is called as part of JSON.stringify and used
   * in tests.
   *
   * You likely do not need to use this method
   */
  public toJSON() {
    return omit(toPlainObject(this), ['get', 'set', 'toJSON'])
  }
}

/**
 * @private
 *
 * Load a file, handling any errors
 */
function safeRequire(file: string) {
  try {
    const config = require(file)
    if (Object.keys(config).length === 1 && config.default) {
      return config.default
    }

    return config
  } catch (err) {
    return {}
  }
}

/**
 * @private
 *
 * Determine the path of the module's parent (the calling module) to
 * assist in auto-generating the config path
 */
function parentPath() {
  return dirname(module!.parent!.filename)
}
