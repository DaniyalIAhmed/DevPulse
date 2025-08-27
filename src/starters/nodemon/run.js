// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemon = require('nodemon');

nodemon({ script: 'index.js' })
  .on('start', console.clear)
  .on('restart', console.clear)
  .on('quit', () => {
    console.log('App has quit');
    process.exit();
  });
