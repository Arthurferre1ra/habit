import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../habits-database";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

//Unitários: Testam uma unica unidade da aplicação, isoladamente
//Integração: Teste de duas ou mais unidades da aplicação
//E2E - ponta a ponta: simula um usuário real utilizando da aplicação

export async function habitsRoutes(app: FastifyInstance) {
    app.get('/habits', {
        preHandler: [ checkSessionIdExists ]
    }, async (req, res) => {
        const { sessionID } = req.cookies;

        const habits = await db('habits').select('*')
        
        return { habits }
    }) 

    app.get('/habits/:habitId', {
        preHandler: [ checkSessionIdExists ]
    }, async (req, res) => {
        const getHabitParamsSchema = z.object({
            habitId: z.string().uuid()
        })

        const { habitId } = getHabitParamsSchema.parse(req.params)
        const { sessionID } = req.cookies;

        const habit = await db('habits').select('*').where('habitId', habitId).first()

        return habit
    })

    app.post('/habits', {
        //preHandler: [ checkSessionIdExists ]
    }, async (req, res) => {
        const createHabitsBodySchema = z.object({
            habit: z.string(),
            category: z.string(),
        })

        const { habit, category } = createHabitsBodySchema.parse(req.body);

        let sessionID = req.cookies.sessionID

        if (!sessionID) {
                sessionID = randomUUID()
    
                res.cookie('sessionID', sessionID, {
                    path: '/',
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Dias
                })
            }
        await db('habits')
        .insert({
            habitId: randomUUID(),
            habit,
            category,
            sessionId: sessionID
        }).returning('*')

        return res.status(201).send('Novo possível hábito registrado. Faça valer!')
    })
}