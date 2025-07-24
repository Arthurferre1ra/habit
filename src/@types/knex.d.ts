import { UUID } from 'crypto'
import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            userId: string
            userName: string
            document: string
            email: string
        }

        habits: {
            habitId: string
            habit: string
            category: string
            startHabit: string
            sessionId: string
        }
    }
}