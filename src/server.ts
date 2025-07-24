import fastify from "fastify";
import cookie from '@fastify/cookie';
import { usersRoutes } from "./routes/users";
import { habitsRoutes } from "./routes/habits";

const app = fastify();

app.register(cookie)
app.register(usersRoutes)
app.register(habitsRoutes)

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running!')
})