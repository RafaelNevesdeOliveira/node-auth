import { FastifyInstance } from "fastify";
import { prisma } from "../src/config/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import Mail from "./services/email";

export async function appRoutes(app: FastifyInstance) {
  app.post("/register", async (request, response) => {
    const createUser = z.object({
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().toLowerCase(),
      password: z.string(),
    });

    const { first_name, last_name, email, password } = createUser.parse(
      request.body
    );

    const oldUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!createUser) {
      return {
        message: "All input is required",
      };
    }

    if (oldUser) {
      return {
        message: "User Already Exist. Please try another email",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password,
      },
    });

    const message: any = Object.assign({}, request.body);
    // enviar o e-mail de boas-vindas ao novo usuário

    Mail.to = message.email;
    Mail.subject = "Bem-vindo ao nosso site";
    Mail.message = "<p>Olá " + first_name + ", Envio de email deu certo carai, usuario cadastrado, sua senha é: OTARIO</p>";

    let resultEnviar = await Mail.sendMail();
    console.log(resultEnviar)
    return response.status(201).send(newUser);
  });

  app.post("/login", async (request, response) => {
    const login = z.object({
      email: z.string().toLowerCase(),
      password: z.string(),
    });
    const { email, password } = login.parse(request.body);

    if (!(email && password)) {
      return {
        message: "All input is required",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      const token = jwt.sign({ user_id: user.id, email }, "secret", {
        expiresIn: "2h",
      });

      user.token = token;

      response.status(200).send(user);
    }
    response.status(400).send("Invalid Credentials");
  });

  app.post("/email", async (request, response) => {
    const message: any = Object.assign({}, request.body);

    Mail.to = message.to;
    Mail.subject = message.subject;
    Mail.message = message.message;

    let result = await Mail.sendMail();

    response.status(200).send({ result: result });
  });
}
