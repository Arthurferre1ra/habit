import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExists(request: FastifyRequest, response: FastifyReply) {
    const { sessionID } = request.cookies;

    if (!sessionID) {
        return response.status(401).send({
            error: 'Unauthorized.'
        })
    }
}