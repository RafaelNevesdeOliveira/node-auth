import * as nodemailer from 'nodemailer';
import config from '../config/email-config';

class Mail {

  constructor(
    public to?: string,
    public subject?: string,
    public message?: string
  ) { }

  async sendMail() {
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
      const info = await transporter.sendMail(mailOptions);
      console.log("E-mail enviado com sucesso: ", info);
      return "E-mail enviado com sucesso!";
    } catch (error) {
      console.error("Erro ao enviar e-mail: ", error);
      throw error;
    }
  }
}

export default new Mail();