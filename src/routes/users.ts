import { FastifyInstance } from "fastify"
import { db } from "../habits-database"
import z from 'zod'
import { randomUUID } from "crypto"

// Cookie <-> São formas de mantermos o contexto entre requisições

export async function usersRoutes(app: FastifyInstance) {
    app.get('/users', async () => {
        const users = await db('users').select('*')

        return { users }
    })

    app.get('/users/:userId', async (req, res) => {
        const getUserParamsSchema = z.object({
            userId: z.string().uuid().nullish()
        })

        const { userId } = getUserParamsSchema.parse(req.params)

        const user = await db('users').where('userId', userId).first()

        return { user }
    })

    app.post('/users', async (req, res) => {
        const createUsersBodySchema = z.object({
            userName: z.string(),
            document: z.string(),
            email: z.string()
        })

        const { userName, document, email } = createUsersBodySchema.parse(req.body);

        await db('users')
        .insert({
            userId: randomUUID(),
            userName,
            document,
            email
        })

        return res.status(201).send('Usuário criado com sucesso.')
    })
}