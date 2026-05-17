const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const proxyOptions = {
    target: 'http://localhost',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',  // Enable debug logging
    onProxyReq: (proxyReq, req, res) => {
      // Add CORS headers
      proxyReq.setHeader('Access-Control-Allow-Origin', '*');
      proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      proxyReq.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      
      // Log the request for debugging
      console.log('Proxying:', req.method, req.originalUrl);
      
      // For POST requests, ensure the body is properly forwarded
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy Error:', err);
      if (!res.headersSent) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
      }
      res.end(JSON.stringify({ error: 'Proxy Error', details: err.message }));
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add CORS headers to the response
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
  };

  // Proxy all API requests
  app.use(
    '/categoryRegistration/catogeryRegisterbackend',
    createProxyMiddleware({
      ...proxyOptions,
      pathRewrite: {
        '^/categoryRegistration/catogeryRegisterbackend': ''
      }
    })
  );

  // Proxy for API routes with specific endpoints
  app.use(
    '/api/attendance',
    createProxyMiddleware({
      ...proxyOptions,
      target: 'http://localhost',
      pathRewrite: {
        '^/api/attendance': '/categoryRegistration/catogeryRegisterbackend/attendance_api.php'
      },
      logLevel: 'debug'
    })
  );

  // Proxy for events API
  app.use(
    '/api/events',
    createProxyMiddleware({
      ...proxyOptions,
      target: 'http://localhost',
      pathRewrite: {
        '^/api/events': '/categoryRegistration/catogeryRegisterbackend/events.php'
      }
    })
  );

  // Proxy for member API
  app.use(
    '/api/member',
    createProxyMiddleware({
      ...proxyOptions,
      target: 'http://localhost',
      pathRewrite: {
        '^/api/member': '/categoryRegistration/catogeryRegisterbackend/QRMember.php'
      }
    })
  );
};
