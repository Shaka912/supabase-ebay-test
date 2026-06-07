import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`\u{1F680} eBay Product API listening on http://localhost:${env.PORT}`);
  console.log('   POST /api/products  — save an eBay product');
  console.log('   GET  /api/products  — list saved products');
  console.log('   GET  /health        — health check');
});

// Graceful shutdown so Docker/CTRL+C stop cleanly.
function shutdown(signal: string): void {
  console.log(`\n${signal} received, shutting down...`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
