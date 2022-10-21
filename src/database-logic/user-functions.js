const prisma = require("./prisma-client.js");

async function addCardToProfileById(cardId, username) {
  const card = await prisma.card.findUnique({
    where: {
      id: cardId
    }
  })
  if (card) {
    await prisma.player.update({
      where: {
        name: username
      },
      data: {
        Card: {
          create: { 
            card: {
              connect: {
                id: cardId
              }
            }
          }
        }
      }
    })
    return card
  } else {
    console.error('Card not found')
    return null
  }

}

async function getUserId(name){
  const response = await prisma.player.findUnique({
    where: {
      name: name
    },
    select: {
      id: true
    }
  })
  return response.id
}

async function getUniqueCard(instanceId){
  return await prisma.cardsOnPlayers.findUnique({
    where: {
      id: parseInt(instanceId)
    }
  })
}

async function deleteUniqueCard(instanceId){
  await prisma.cardsOnPlayers.delete({
    where: {
      id: parseInt(instanceId)
    }
  })
}


module.exports = { 
  addCardToProfileById,
  getUserId, 
  getUniqueCard,
  deleteUniqueCard
}
