#! /usr/bin/env node

const { dConfig } = require('../dist/cli');
dConfig()
  .then(stdout => {
    if (stdout) console.log(stdout);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
