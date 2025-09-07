/**
 * Dedicated server for Agent Control Dashboard
 * Runs on port 8888 to avoid conflicts
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 8888; // Special port for agent control

// Configure Next.js with custom directory
const app = next({ 
  dev,
  hostname,
  port,
  dir: process.cwd()
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Handle agent control routes
      if (pathname.startsWith('/agent-control')) {
        await handle(req, res, parsedUrl);
      } else if (pathname.startsWith('/api/agents')) {
        await handle(req, res, parsedUrl);
      } else {
        // Redirect root to agent control
        if (pathname === '/') {
          res.writeHead(302, { Location: '/agent-control' });
          res.end();
        } else {
          await handle(req, res, parsedUrl);
        }
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║           AGENT CONTROL DASHBOARD SERVER               ║
║                                                        ║
║  Status: RUNNING                                       ║
║  Port: ${port}                                           ║
║  URL: http://${hostname}:${port}/agent-control              ║
║                                                        ║
║  Features:                                             ║
║  • 10 Claude SDK Agents                               ║
║  • Memory & Learning System                           ║
║  • Knowledge Graph                                    ║
║  • Specialized Workflows                              ║
║  • Personality Evolution                              ║
║  • Direct Agent Chat                                  ║
║                                                        ║
║  Press Ctrl+C to stop                                 ║
╚════════════════════════════════════════════════════════╝
      `);
    });
});