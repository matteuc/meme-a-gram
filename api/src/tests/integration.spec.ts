// src/tests/integration.spec.ts
import request from 'supertest'
import { buildServer } from '../server'
import { FastifyInstance } from 'fastify'
describe(`Integration`, () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildServer()

    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  describe(`Query feed(...)`, () => {
    it(`Should return correct response`, async () => {
      const query = `
        query {
          feed {
              id
              title
              imageUrl
          }
        }
      `

      const res = await request(app.server)
        .post('/graphql')
        .send({
          query,
        })
        .expect(200)

      if (res.error) console.error(res.error)

      const allFieldsPresent = res.body.data.feed.every(
        (item: any) => item.id && item.title && item.imageUrl,
      )

      expect(allFieldsPresent).toBeTruthy()
    })
  })

  describe(`Query getCurrentUser(...)`, () => {
    it(`Should fail without a JWT`, async () => {
      const query = `
        query {
            getCurrentUser {
              id
          }
        }
      `

      const res = await request(app.server).post('/graphql').send({
        query,
      })

      // Can't assert against 401 status code as there appears to be an issue with mercurius custom error handlers
      expect(
        res.body.errors.some((e: any) =>
          e.message.includes('User not authenticated'),
        ),
      ).toBeTruthy()
    })
  })
})
