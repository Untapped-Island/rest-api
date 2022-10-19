'use strict';

const { userModel } = require('../models/usersSchema');

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
      console.log('from bearer middleware', token);

      let validUser = userModel.authorization(token);
      if (validUser) {
        req.user = validUser;
        next();
      }
    } catch (e) {
      console.error(e);
      next(e.message);
    }
  }
};
