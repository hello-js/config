# hello-config

Simple environment-specific configuration for your node apps

[![Build Status](https://img.shields.io/travis/hello-js/hello-config/master.svg)](https://travis-ci.org/hello-js/hello-config)
[![Coverage Status](https://img.shields.io/coveralls/hello-js/hello-config.svg)](https://coveralls.io/github/hello-js/hello-config)

## Installation

```sh
yarn add hello-config
```

## Usage

hello-config loads environment-specific config files from a directory.

### Setup

The easiest way to get set up is running the following from your command line

```sh
yarn hello-config
```

This will create a `config` directory that is ready to be required anywhere in your app (`const config = require('./config');`)

### Manual Setup

You can also set up `hello-config` manually.

```js
/**
 * config/index.js
 */

const Config = require('hello-config')

module.exports = Config.load()
```

```typescript
// Or as typescript:
import { load } from 'hello-config'

export default load()
```

The above code will load `config/default.js` and merge in contents from `config/development.js` as overrides.

If there is a `config/development.local.js` file, this will be merged in as well. You can have a `.local.js` file for any environment.

You can also set local environment variables using a [`.env`](https://github.com/motdotla/dotenv) file the root of your project if you'd like.

_NOTE:_ `*.local.js` and `.env` should be added to `.gitignore` -- it should only be used for developer-specific settings

### Recommended directory structure

The recommended directory structure is

```
./config/
  default.js
  development.js
  index.js
  production.js
  test.js
```

Sample `config/index.js` file:

```js
const Config = require('hello-config')

module.exports = Config.load()
```

Sample `default.js` file:

```js
module.exports = {
  port: process.env.PORT || 80,

  db: {
    host: process.env.DATABASE_HOST,
    username: 'matt'
    // ...
  }
}
```

Sample `development.js` file:

```js
module.exports = {
  port: 3000,

  db: {
    host: '127.0.0.1'
  }
}
```

At this point, you can run the following code:

```js
config config = require('./config');

config.port;
// => 3000

config.get('port');
// => 3000

config.db.host;
// => '127.0.0.1'

config.get'db.host');
// => '127.0.0.1'

config.does.not.exist;
// => TypeError: Cannot read property 'not' of undefined

config.get('does.not.exist');
// => undefined
```

### Custom directory structure

You can use any directory structure you prefer. For example, to have a
structure like the following:

```
config/
  index.js
  environments/
    all.js
    development.js
    production.js
    test.js
```

You can use the following options for `Config.load()`:

```js
const path = require('path')
const Config = require('hello-config')

module.exports = Config.load({
  root: path.join(__dirname, 'environments'),
  baseFilename: 'all'
})
```

By default, hello-config uses `process.env.NODE_ENV` as the environment, however,
if you'd like, you can directly load an environment's configuration:

```js
// Loads the test environment:
Config.load({
  env: 'test'
})
```
