import nodemailer from "nodemailer";

//CONFIGURE HOST
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "segoviadevelop@gmail.com",
    pass: "ULmE9mKjSvHH2RV"
  }
});

/* GUIE PARAMS
let mailOptions = {
    from: "segoviadevelop@gmail.com",
    to: "jose.segovia.r@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!"
  };
*/
export const sendMail = async mailOptions => {
  let info = await transporter.sendMail(mailOptions);
  return info;
};

export const sendMailTest = async () => {
  /* GMAIL
    Servidor SMTP: smtp.gmail.com
    Usuario SMTP: Tu usuario de Gmail completo (email), por ejemplo tuemail@gmail.com
    Contraseña SMTP: Tu contraseña de Gmail.
    Puerto SMTP: 587
    TLS/SSL: Requerido.
    */
  let transporterTesting = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "segoviadevelop@gmail.com",
      pass: "ULmE9mKjSvHH2RV"
    }
  });

  let mailOptions = {
    from: '"Segovia Develop 👻" <segoviadevelop@gmail.com>',
    to: "jose.segovia.r@gmail.com",
    subject: "Hello ✔ Testing Send Mail Node.Js", // Subject line
    text: "Hello world? Testing...", // plain text body
    html: "<b>Hello world?</b><br /><h1>Testing...<h1/>" // html body
  };

  let info = await transporterTesting.sendMail(mailOptions);

  if (info) {
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  return info;
};

export default sendMail;
