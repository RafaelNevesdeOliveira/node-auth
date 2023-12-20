var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from "../src/config/prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import Mail from "./services/email";
export function appRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post("/register", (request, response) => __awaiter(this, void 0, void 0, function* () {
            const createUser = z.object({
                first_name: z.string(),
                last_name: z.string(),
                email: z.string().toLowerCase(),
                password: z.string(),
            });
            const { first_name, last_name, email, password } = createUser.parse(request.body);
            const oldUser = yield prisma.user.findFirst({
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
            const newUser = yield prisma.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password,
                },
            });
            const message = Object.assign({}, request.body);
            // enviar o e-mail de boas-vindas ao novo usuário
            Mail.to = message.email;
            Mail.subject = "Bem-vindo ao nosso site";
            Mail.message = "<p>Olá " + first_name + ", Envio de email deu certo carai, usuario cadastrado, sua senha é: OTARIO</p>";
            let resultEnviar = yield Mail.sendMail();
            console.log(resultEnviar);
            return response.status(201).send(newUser);
        }));
        app.post("/login", (request, response) => __awaiter(this, void 0, void 0, function* () {
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
            const user = yield prisma.user.findFirst({
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
        }));
        app.post("/email", (request, response) => __awaiter(this, void 0, void 0, function* () {
            const message = Object.assign({}, request.body);
            Mail.to = message.to;
            Mail.subject = message.subject;
            Mail.message = message.message;
            let result = yield Mail.sendMail();
            response.status(200).send({ result: result });
        }));
    });
}
//# sourceMappingURL=routes.js.map