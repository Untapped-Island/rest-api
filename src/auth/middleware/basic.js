'use strict';

const bcrypt = require('bcrypt');
const base64 = require('base-64');
const prisma = require("../../database-logic/prisma-client.js");
const jwt = require('../../../utils/jwt.js');

async function basicAuth(req, res, next) {
  let { authorization } = req.headers;
  console.log('authorization:', authorization);
  if (!authorization) {
    res.status(401).send('Not Authorized');
  } else {
    let authString = authorization.split(' ')[1];
    // console.log('authstr:', authString);
    let decodedAuthString = base64.decode(authString);
    // console.log('decodedAuthString:', decodedAuthString); 
    let [username, password] = decodedAuthString.split(':');
    // console.log('username:', username);
    // console.log('password:'.password);
    let user = await prisma.player.findUnique({ 
      where: { 
        name: username
      } 
    });
    // console.log('user:', user);
    if (user) {

      let validUser = await bcrypt.compare(password, user.password);
      // console.log('validUser', validUser);
      if (validUser) {
        req.userId = user.id
        req.user = user.name;
        req.accessToken = await jwt.signAccessToken({
          userId: user.id,
          user: user.name
        });
        next();
      } else {
        next('Invalid username or password');
      }
    } else next('Invalid username or password');
  }
}
module.exports = {basicAuth};

