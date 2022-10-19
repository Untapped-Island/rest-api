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

async function getCardsByFilter(query) {
  let allSearchQueries = []
  if (query.search) allSearchQueries.push({
    name: {
      search: query.search.split(" ").join(" & "),
    },
  })
  if (query.colors) allSearchQueries.push({
    colors: parseInt(query.colors)
  })
  if (query.colorIdentity) allSearchQueries.push({
    colorIdentity: parseInt(query.colorIdentity)
  })
  if (query.formats) allSearchQueries.push({
    formats: parseInt(query.formats)
  })
  if (query.power) allSearchQueries.push({
    power: parseInt(query.power)
  })
  if (query.toughness) allSearchQueries.push({
    toughness: parseInt(query.toughness)
  })
  if (query.manaValue) allSearchQueries.push({
    manaValue: parseInt(query.manaValue)
  })
  const cards = await prisma.card.findMany({ where: { AND: allSearchQueries } })
  return cards
}

module.exports = {
  getOneCardById,
  getOneCardByName,
  getCardsByFilter
}