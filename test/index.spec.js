'use strict';

const Config = require('../lib');
const path = require('path');
const test = require('ava');

const fixture = path.join(__dirname, '.', 'fixtures');

test('new Config() allows being given no configuration', t => {
  const config = new Config();

  t.deepEqual(config.toJSON(), {});
});

test('new Config() allows being passed a default configuration', t => {
  const config = new Config({
    some: 'setting'
  });

  t.deepEqual(config.toJSON(), {
    some: 'setting'
  });
});

test('new Config() allows being passed an existing Config instance', t => {
  const config = Config.load({
    root: fixture
  });
  const config2 = new Config(config);

  t.deepEqual(config2, config);
});

test('Config.load() loads all of the appropriate config files from the directory', t => {
  const config = Config.load({
    root: fixture
  });

  t.deepEqual(config.toJSON(), {
    env: 'test',
    file: 'test.local.js',
    local: 'loaded',
    test: 'loaded',
    default: 'loaded',
    arrays: ['local'],
    objects: {
      default: true,
      test: true,
      local: true
    }
  });
});

test('Config.load() safely handles being given an invalid config directory', t => {
  const badConfig = Config.load(path.join(__dirname, '..', 'fixtures', 'bad-config'));

  t.deepEqual(badConfig.toJSON(), {
    env: 'test'
  });
});

test('Config.load() does not require any arguments', t => {
  const config = Config.load();

  t.deepEqual(config.toJSON(), {
    env: 'test'
  });
});

test('Config.load() allows passinging in a custom env', t => {
  const config = Config.load({
    env: 'development'
  });

  t.is(config.env, 'development');
});

test('Config.load() defaults to loading the `development` environment if no NODE_ENV is set', t => {
  const env = process.env.NODE_ENV;
  delete process.env.NODE_ENV;
  const config = Config.load({
    root: fixture
  });

  t.is(config.env, 'development');

  process.env.NODE_ENV = env;
});

test('Config.get() returns the value at a given key path', t => {
  const config = Config.load({
    root: fixture
  });

  t.true(config.get('objects.local'));
});

test('Config.get() returns undefined if the value is not defined', t => {
  const config = Config.load({
    root: fixture
  });

  t.falsy(config.get('some.where.over.the.rainbow'));
});

test('Config.set() sets new values', t => {
  const config = Config.load({
    root: fixture
  });
  config.set('newValue', 2);

  t.is(config.get('newValue'), 2);
});

test('Config.set() overwrites existing values at keypaths', t => {
  const config = Config.load({
    root: fixture
  });
  config.set('objects.local', 'overwritten');

  t.is(config.get('objects.local'), 'overwritten');
});

test('Config.set() allows setting a deep key path that is not defined', t => {
  const config = Config.load({
    root: fixture
  });
  config.set('some.where.over.the.rainbow', 'abc');

  t.is(config.get('some.where.over.the.rainbow'), 'abc');
});
