import { test, expect, beforeAll, afterAll, describe } from "vitest";
import request from 'supertest'
import { app } from "../src/app";

describe('Users Routes', async () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll( async () => {
    app.ready()
  })

  test.skip('user can create a new habit', async () => {
     await request(app.server)
      .post('/users')
      .send({
        userName: 'Jhon Doe',
        document: '12332123422',
        email: 'jhondoe2@gmail.com'
      })
  })

  test.skip('should be able to list all habits', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        userName: 'Jhon Doe',
        document: '12332112345',
        email: 'jhondoe@gmail.com'
      })

      const listAllUserResponse = await request(app.server)
        .get('/users')
        .expect(200)

        console.log(listAllUserResponse.body)
  })
})