import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import log4js from 'log4js';
import swaggerTools from 'swagger-tools';

let log = log4js.getLogger("server");
const app = express();

const env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'development';
// Getting configuration
import config from './config';

import authentication from './utility/authentication.js';

// Add a body parsing middleware to our API
app.use(bodyParser.json());

//logger
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

// Authentication for Each Route
app.use((req, res, next) => {
  if(req.url == '/users/login' || req.url.startsWith('/docs') || req.url == '/api-docs') {
    next();
  } else {
    if(req.headers && req.headers.authorization) {
      let token = req.headers.authorization;
      authentication.verifyAccessToken(jwt, token, config.jwt)
      .then(() => {
        next();
      })
      .catch((err) => {
        res.statusCode = 401;
        next(err);
      }).done();
    } else {
      let err = new Error('Authorization header is not specified');
      res.statusCode = 401;
      next(err);
    }
  }
});

// swaggerRouter configuration
var options = {
  controllers: './lib/web'
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
let swaggerDoc = require('./swagger/v1.json');

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  const port = process.env.PORT || 5000;
  // Start the server
  app.listen(port, () => {
    log.info('Service listening on port ' + port + '!')
  });

  // Not Error handler
  app.use((req, res, next) => {
    let err = new Error('Not Found');
    res.statusCode = 404;
    next(err);
  });

  // Error handler
  app.use((err, req, res, next) => {
    if(res.statusCode === 200) {
      res.statusCode = 400;
    }
    log.error("Error:", err);
    res.send(err.toString());
  });
});

export default app;
