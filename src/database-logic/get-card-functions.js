const prisma = require("./prisma-client.js");

async function getOneCardById(id) {
  const card = await prisma.card.findUnique({
    where: {
      id: id
    }
  })
  return card
}

async function getOneCardByName(name) {
  const card = await prisma.card.findUnique({
    where: {
      name: name
    }
  })
  return card
}

async function getCardsBySearchQuery(query) {
  const cards = await prisma.card.findMany({
    where: {
      name: {
        search: query.split(" ").join(" & "),
      },
    },
  })
  return cards
}

module.exports = {
  getOneCardById,
  getOneCardByName,
  getCardsBySearchQuery
}