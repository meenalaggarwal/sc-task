import jwt from 'jsonwebtoken';
import log4js from 'log4js';

// Getting configuration
import config from '../config';

let log = log4js.getLogger("users");

import authentication from '../utility/authentication.js';

module.exports.loginUser = function loginUser(req, res, next) {
  log.info("Entering login user route");
  let response = {access_token : authentication.getAccessToken(jwt, req.body, config.jwt)};
  res.send(response);
};
