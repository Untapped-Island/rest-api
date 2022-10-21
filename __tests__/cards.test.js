'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const mockRequest = supertest(app);

let userData = {
  username: 'user2',
  password: 'test',
};
beforeAll(async () => {
  let userResponse = await mockRequest.post('/signup').send(userData)
  // mockRequest.post('/signin').auth(userData.username, userData.password)
  userData.accessToken = userResponse.body.accessToken
  console.log('accessToken',userResponse.body)
})
afterAll(async () => {
  console.log('is this running?')
  await mockRequest.delete(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.accessToken}`)
})

describe('card routes', () => {
  test('Get one card by id', async () => {
    let response = await mockRequest.get('/cards/01800a0c-ad93-4e45-a904-38253a143638')

    expect(response.status).toEqual(200)
    expect(response.body.name).toEqual('Zodiac Goat')
  })
  test('Handle request for card that does not exist', async () => {
    let response = await mockRequest.get('/cards/fail')

    expect(response.status).toEqual(500)
    expect(response.body.message).toEqual('There is no card with that id')
  })

  test('Get all cards in proper batch', async () => {
    let response = await mockRequest.get('/cards')

    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(10)
  })

  test('Add a card to a users portfolio', async () => {
    let response = await mockRequest.post(`/users/${userData.username}/cards`).set('Authorization', `Bearer ${userData.accessToken}`).send({card: '01800a0c-ad93-4e45-a904-38253a143638'})

    expect(response.status).toEqual(200)
    expect(response.text).toEqual('added')
  })
  test('Get a card from a users portfolio', async () => {
    let response = await mockRequest.get(`/users/${userData.username}/cards`).set('Authorization', `Bearer ${userData.accessToken}`)
    userData.cardId = response.body[0].id
    console.log(userData.cardId)
    expect(response.status).toEqual(200)
    expect(response.body[0].card.name).toEqual('Zodiac Goat')
  })
  test('Get a unique card from a users portfolio', async () => {
    let response = await mockRequest.get(`/users/${userData.username}/cards/${userData.cardId}`).set('Authorization', `Bearer ${userData.accessToken}`)

    expect(response.status).toEqual(200)
    expect(response.body.id).toEqual(userData.cardId)
  })
  test('Remove a card from a users portfolio', async () => {
    let response = await mockRequest.delete(`/users/${userData.username}/cards/${userData.cardId}`).set('Authorization', `Bearer ${userData.accessToken}`)
    let verify = await mockRequest.get(`/users/${userData.username}/cards/${userData.cardId}`).set('Authorization', `Bearer ${userData.accessToken}`)

    expect(response.status).toEqual(200)
    expect(response.text).toEqual('success')
    expect(verify.text).toEqual('This card does not exist.')
  })
})