'use strict';

require('dotenv').config();

const express = require('express');

const portfolioRouter = express.Router();
// USE MIDDLEWARE IN ALL ROUTES



const bearerAuth = require('../../auth/middleware/bearer');

const { 
  addCardToProfileById,
  getUserId,
  getUniqueCard,
  deleteUniqueCard
} = require('../../database-logic/user-functions')

const prisma = require('../../database-logic/prisma-client.js');


portfolioRouter.get('/users/:username', bearerAuth, async (req, res, next) => {
  // const foundUser = await getUserByUsername(req.params.username) // TODO - Write this function...
  const foundUser = await prisma.player.findUnique({
    where: {
      name: req.params.username
    }
  })
  if (foundUser) {
    if (req.user.payload === foundUser.name) {
      console.log('Hey, this is you')
    } else {
      console.log(`Found user ${foundUser.name}. Is this your friend?`)
    }
    res.status(200).send(foundUser.name)
  } else {
    next(`User ${req.params.username} not found.`)
  }
}) 

portfolioRouter.get('/users/:username/cards', bearerAuth, async (req, res, next) => {
  try {
    const cards = await getCardsByFilter(req.query, req.params.username)
    res.status(200).send(cards)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

portfolioRouter.post('/users/:username/cards', bearerAuth, async (req, res, next) => {
  try {
    console.log(req.params.username)
    console.log(req.user.payload)
    if (req.params.username === req.user.payload) {
      if (req.body.card) {
        await addCardToProfileById(req.body.card, req.user.payload)
      } 
      else if (req.body.cards) {
        for (let card of req.body.cards) {
          await addCardToProfileById(card, req.user.payload)
        }
      }
    } else {
      return res.status(401).send('Cannot add card to a portfolio that you do not own.')
     
    }

    res.status(200).send('added')
  } catch (err) {
    console.error(err);
    next(err);    
  }
})

portfolioRouter.get('/users/:username/cards/:instanceId', bearerAuth, async (req, res, next) => {
  try {
    // Place the user id on the request using the JWT so we don't have to do this.
    const userId = await getUserId(req.params.username);
    const card = await getUniqueCard(req.params.instanceId);
    if (!card) {
      return res.status(400).send('This card does not exist.')
    }
    if (card.playerId === userId) {
      res.status(200).send(card)
    } else {
      return res.status(400).send('This card does not exist in this portfolio.')
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
})

portfolioRouter.delete('/users/:username/cards/:instanceId', bearerAuth, async (req, res, next) => {
  try {
    if (req.params.username === req.user.payload) {
      // Place the user id on the request using the JWT so we don't have to do this.
      const userId = await getUserId(req.params.username);
      const card = await getUniqueCard(req.params.instanceId);
      if (card && card.playerId === userId) {
        await deleteUniqueCard(req.params.instanceId);
        res.status(200).send('success')
      } else {
        return res.status(401).send('Cannot delete a card from a portfolio where it does not exist.')
      }
    } else {
      return res.status(401).send('Cannot delete a card from a portfolio that you do not own.')
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

portfolioRouter.get('/jwtProtect', bearerAuth, async (req, res, next) => {
  res.status(200).send(req.user.payload)
});



module.exports = portfolioRouter;

