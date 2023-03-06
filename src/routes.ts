import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance){

    app.post("/register", async (request) =>{
        console.log(request.body);
        return {message: "Hello World"}
    })
}