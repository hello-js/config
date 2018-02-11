# hello-config

Simple environment-specific configuration for your node apps

[![Build Status](https://img.shields.io/travis/hello-js/hello-config/master.svg)](https://travis-ci.org/hello-js/hello-config)
[![Coverage Status](https://img.shields.io/coveralls/hello-js/hello-config.svg)](https://coveralls.io/github/hello-js/hello-config)

## Installation

```
yarn add hello-config
```

## Usage

hello-config loads environment-specific config files from a directory.

### Setup

```js
const path = require('path');
const Config = require('hello-config');

const config = Config.load(path.join(__dirname, 'environments'));
```

The above code will load `./environments/default.js` and merge in `./environments/development.js` overrides.

If there is a `./environments/development.local.js` file, this will be merged in as well.

*NOTE:* `*.local.js` should be added to `.gitignore` -- it should only be used for developer-specific settings

### Recommended directory structure

The recommended directory structure is

```
./config/
  index.js
  environments/
    default.js
    development.js
    production.js
    staging.js
    test.js
```


Sample `config/index.js` file:

```js
'use strict';

const path = require('path');
const Config = require('hello-config');

module.exports = Config.load(path.join(__dirname, 'environments'));
```

Sample `default.js` file:

```js
'use strict';

module.exports = {
  port: process.env.PORT || 80,

  db: {
    host: process.env.DATABASE_HOST,
    username: 'matt'
    // ...
  }
};
```

Sample `development.js` file:

```js
'use strict'

module.exports = {
  port: 3000,

  db: {
    host: '127.0.0.1'
  }
};
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
