var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as nodemailer from 'nodemailer';
import config from '../config/email-config';
class Mail {
    constructor(to, subject, message) {
        this.to = to;
        this.subject = subject;
        this.message = message;
    }
    sendMail() {
        return __awaiter(this, void 0, void 0, function* () {
            let mailOptions = {
                from: "",
                to: this.to,
                subject: this.subject,
                html: this.message
            };
            const transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: false,
                auth: {
                    user: config.user,
                    pass: config.password
                },
                tls: { rejectUnauthorized: false }
            });
            console.log(mailOptions);
            try {
                const info = yield transporter.sendMail(mailOptions);
                console.log("E-mail enviado com sucesso: ", info);
                return "E-mail enviado com sucesso!";
            }
            catch (error) {
                console.error("Erro ao enviar e-mail: ", error);
                throw error;
            }
        });
    }
}
export default new Mail();
//# sourceMappingURL=email.js.map