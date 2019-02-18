import { forEach } from 'lodash'
import { join } from 'path'
import Config from '../lib'

const fixtures = {
  javascript: join(__dirname, '.', 'fixtures', 'javascript'),
  typescript: join(__dirname, '.', 'fixtures', 'typescript')
}

test('new Config() allows being given no configuration', () => {
  const config = new Config()

  expect(config.toJSON()).toEqual({})
})

test('new Config() allows being passed a default configuration', () => {
  const config = new Config({
    some: 'setting'
  })

  expect(config.toJSON()).toEqual({
    some: 'setting'
  })
})

test('Config.load() safely handles being given an invalid config directory', () => {
  const badConfig = Config.load(join(__dirname, '..', 'fixtures', 'bad-config'))

  expect(badConfig.toJSON()).toEqual({
    env: 'test'
  })
})

test('Config.load() does not require any arguments', () => {
  const config = Config.load()

  expect(config.toJSON()).toEqual({
    env: 'test'
  })
})

test('Config.load() allows passinging in a custom env', () => {
  const config = Config.load({
    env: 'development'
  })

  expect(config.env).toEqual('development')
})

forEach(fixtures, (fixture, type) => {
  describe(`${type} configs`, () => {
    test('new Config() allows being passed an existing Config instance', () => {
      const config = Config.load({
        configRoot: fixture
      })
      const config2 = new Config(config)

      expect(config2).toEqual(config)
    })

    test('Config.load() loads all of the appropriate config files from the directory', () => {
      const config = Config.load({
        configRoot: fixture
      })

      expect(config.toJSON()).toEqual({
        arrays: ['local'],
        default: 'loaded',
        env: 'test',
        file: 'test.local.js',
        local: 'loaded',
        objects: {
          default: true,
          local: true,
          test: true
        },
        test: 'loaded'
      })
    })

    test('Config.load() defaults to loading the `development` environment if no NODE_ENV is set', () => {
      const env = process.env.NODE_ENV
      delete process.env.NODE_ENV
      const config = Config.load({
        configRoot: fixture
      })

      expect(config.env).toEqual('development')

      process.env.NODE_ENV = env
    })

    test('Config.get() returns the value at a given key path', () => {
      const config = Config.load({
        configRoot: fixture
      })

      expect(config.get('objects.local')).toBeTruthy()
    })

    test('Config.get() returns undefined if the value is not defined', () => {
      const config = Config.load({
        configRoot: fixture
      })

      expect(config.get('some.where.over.the.rainbow')).toBeFalsy()
    })

    test('Config.set() sets new values', () => {
      const config = Config.load({
        configRoot: fixture
      })
      config.set('newValue', 2)

      expect(config.get('newValue')).toBe(2)
    })

    test('Config.set() overwrites existing values at keypaths', () => {
      const config = Config.load({
        configRoot: fixture
      })
      config.set('objects.local', 'overwritten')

      expect(config.get('objects.local')).toBe('overwritten')
    })

    test('Config.set() allows setting a deep key path that is not defined', () => {
      const config = Config.load({
        configRoot: fixture
      })
      config.set('some.where.over.the.rainbow', 'abc')

      expect(config.get('some.where.over.the.rainbow')).toBe('abc')
    })
  })
})
