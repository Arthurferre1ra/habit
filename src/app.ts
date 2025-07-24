import fastify from "fastify";
import cookie from '@fastify/cookie';
import { usersRoutes } from "./routes/users";
import { habitsRoutes } from "./routes/habits";

export const app = fastify();

app.register(cookie)
app.register(usersRoutes)
app.register(habitsRoutes)
