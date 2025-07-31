import { test, expect, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { it } from 'node:test'

describe('Habits routes', () => {
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

//testes devem se excluir de outros testes. Ou seja: Nenhum teste pode e nem deve depender de outro teste para funcionar.
it.skip('should be able to list all habits', async () => {
    const createHabitResponse = await request(app.server)
        .post('/habits')
        .send({
            habit: 'Read',
            category: 'Personal'
      })

      const cookies = createHabitResponse.get('Set-Cookie')

      const listAllHabitsResponse = await request(app.server)
        .get('/habits')
        //.set('Cookie', cookies)
        .expect(200)

      console.log(createHabitResponse.headers)
    })
})

