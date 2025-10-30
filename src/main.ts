import * as express from 'express';
import config from './config';
import loaders from './loaders';

async function main() {
  const app = express.default();
  await loaders(app);
    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📘 Swagger docs available at http://localhost:${config.port}/docs`);
    });

  // graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    console.log('Express app closed.');
    process.exit(0);
  });
}

main();
