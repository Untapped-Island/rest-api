'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

// USE MIDDLEWARE IN ALL ROUTES
app.use(cors());
app.use(express.json());

const bearerAuth = require('../../auth/middleware/bearer');

const { 
  getOneCardById, 
  getOneCardByName, 
  getCardsByFilter,
} = require('../../database-logic/get-card-functions');

const { 
  addCardToProfileById,
  getUserId,
  getUniqueCard,
  deleteUniqueCard
} = require('../../database-logic/user-functions')

const prisma = require('../../database-logic/prisma-client.js');



  app.get('/cards/:id', async (req, res, next) => {
    try {
      const card = await getOneCardById(req.params.id)
      res.status(200).send(card)
  } catch (err) {
    console.error(err)
    serverError(err, req, res)
  }
});



app.get('/cards', async (req, res, next) => {
  try {
    const cards = await getCardsByFilter(req.query)
    res.status(200).send(cards)
  } catch (err) {
    console.error(err)
    serverError(err, req, res)
  }
})

app.get('/users/:username', bearerAuth, async (req, res, next) => {
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

app.get('/users/:username/cards', bearerAuth, async (req, res, next) => {
  try {
    const cards = await getCardsByFilter(req.query, req.params.username)
    res.status(200).send(cards)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

app.post('/users/:username/cards', bearerAuth, async (req, res, next) => {
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

app.get('/users/:username/cards/:instanceId', bearerAuth, async (req, res, next) => {
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

app.delete('/users/:username/cards/:instanceId', bearerAuth, async (req, res, next) => {
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

app.get('/jwtProtect', bearerAuth, async (req, res, next) => {
  res.status(200).send(req.user.payload)
});



module.exports = app;
