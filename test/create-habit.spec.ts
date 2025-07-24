import { test, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
    app.ready()
})

afterAll(async () => {
    app.close()
})

test('user can create a new habit', async () => {
     await request(app.server)
        .post('/habits')
        .send({
            habit: 'Read',
            category: 'Personal'
      }).expect(201)
})