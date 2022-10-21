'use strict';

const express = require('express');

require('dotenv').config();

const userRouter = express.Router();
// middle
const bearerAuth = require('../../auth/middleware/bearer');
const bcrypt = require('bcrypt');

const prisma = require('../../database-logic/prisma-client');
const jwt = require('../../../utils/jwt');

userRouter.get('/users', bearerAuth, async (req, res, next) => {

  try {
    let allUsers = await prisma.player.findMany();
    let payload = {
      results: allUsers,
    };
    res.status(200).send(payload);
  }
  catch (err) {
    next('User error occurred');
  }
});

// bearer auth implemented, check users by conditional
userRouter.put('/users/:username', bearerAuth, async (req, res, next) => {
  if (req.user !== req.params.username) {
    next('Cannot edit an account you do not own')
  } else {
    try {
      let prismaQuery = {
        data: {
          name: req.body.username,
          password: await bcrypt.hash(req.body.password, 10)
        },
        where: {
          name: req.params.username
        }
      }
      let userUpdate = await prisma.player.update(prismaQuery);
      let newToken = await jwt.signAccessToken({
        user: userUpdate.name,
        userId: req.userId,
      })
      res.status(200).send({
        username: userUpdate.name,
        accessToken: newToken
      });
    }
    catch (err) {
      console.log(err)
      next('update error occurred');
    }
  }
});

// bearer auth implemented, check users by conditional
userRouter.delete('/users/:username', bearerAuth, async (req, res, next) => {
  const { username } = req.params;
  if (req.user !== username) {
    next('Cannot delete an account you do not own')
  } else {
    try {
      const post = await prisma.player.delete({
        where: {
          name: username,
        },
      });
      console.log(post)
      res.status(200).send(`${post.name} deleted`)
    }
    catch (err) {
      console.log(err)
      next('Delete error occurred')
    }
  }
});

module.exports = userRouter;
