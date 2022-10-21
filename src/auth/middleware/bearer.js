'use strict';

const jwt = require('../../../utils/jwt.js')

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    console.log('No authorization provided. Access token required.')
    next('Access token is required');
  } else {
    try {
      const token = req.headers.authorization.split(' ').pop();
      if (!token) {
        console.log('No access token provided')
        return next('Access token is required')
      }

      await jwt.verifyAccessToken(token).then(token => {
        req.user = token.payload.user;
        req.userId = token.payload.userId
        next();
      }).catch (err => {
        next('Unauthorized...')
      })
    } catch (err) {
      console.error(err);
      next(err.message);
    }
  }
};
