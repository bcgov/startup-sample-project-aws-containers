const app = require('./server.js');
const logger = require('./logger.js');
let dbClient = null;
if ('development' === process.env.NODE_ENV) dbClient = require('./db').dbClient;

const port = 80;

/** @type {http.Server|undefined} */
let server;

// shut down server
async function shutdown() {
  if ('development' === process.env.NODE_ENV) await dbClient.disconnect();
  
  if (server) {
    server.close((err) => {
      if (err) {
        logger.error(err);
        process.exitCode = 1;
      }
      process.exit();
    });
  }
}

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', () => {
  logger.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', () => {
  logger.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// Start server
(async () => {
  try {
    if ('development' === process.env.NODE_ENV) await dbClient.connect();
    server = app.listen(port, async () => {
      logger.info(`Listening on port ${port}`);
    });
  } catch (err) {
    logger.error(err);
    shutdown();
  }
})();

//
// need above in docker container to properly exit
//

module.exports = server;
