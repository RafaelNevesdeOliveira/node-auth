import { FastifyInstance } from "fastify";
import { prisma } from "../src/config/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
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

    newUser.token;

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
}
