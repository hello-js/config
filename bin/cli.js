#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const template = `'use strict';

module.exports = {

};
`;

fs.mkdirSync(path.join('.', 'config'));
fs.writeFileSync('./config/index.js', `'use strict';

const Config = require('hello-config');

module.exports = Config.load();
`);

['config', 'development', 'production', 'test'].forEach(env => {
  fs.writeFileSync(path.join('.', 'config', `${env}.js`), template);
});

process.exit(0);
