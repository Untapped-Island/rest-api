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

async function getCardsByFilter(query, user) {
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
  if (query.type) allSearchQueries.push({
    Type: {
      some: {
        id: {
          contains: query.type,
          mode: 'insensitive'
        }
      },
    }
  })
  if (query.subtype) allSearchQueries.push({
    SubType: {
      some: {
        id: {
          contains: query.subtype,
          mode: 'insensitive'
        }
      },
    }
  })
  if (query.supertype) allSearchQueries.push({
    SuperType: {
      some: {
        id: {
          contains: query.supertype,
          mode: 'insensitive'
        }
      },
    }
  })

  const page = parseInt(query.page) - 1 || 0
  const limit = parseInt(query.limit) || 10
  const filters = {
    take: limit,
    skip: limit * page,
  }
  let cards;
  if (user) {
    cards = await prisma.cardsOnPlayers.findMany({
      ...filters,
      orderBy: { card: { name: 'asc' } },
      select: {
        id: true,
        isFoil: true,
        card: true
      },
      where: {
        card: { AND: allSearchQueries },
        player: {
          name: user,
        }
      }
    })
    console.log('search through portfolio')
    console.log(cards)
  } else {
    cards = await prisma.card.findMany({
      where: {
        AND: allSearchQueries
      },
      orderBy: { name: 'asc' },
      ...filters,
    })
    console.log('search for cards only')
    console.log(cards)
  }
  return cards
}


module.exports = {
  getOneCardById,
  getOneCardByName,
  getCardsByFilter
}