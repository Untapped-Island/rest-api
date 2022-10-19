const prisma = require("./prisma-client.js");

async function addCardToProfileById(cardId, username) {
  const card = await prisma.card.findUnique({
    where: {
      id: cardId
    }
  })
  console.log('CARD FOUND')
  console.log(card)
  const player = await prisma.player.update({
    where: {
      name: username
    },
    data: {
      Card: {
        connect: { id: cardId }
      }
    }
  })
  return player
}

module.exports = { addCardToProfileById }
