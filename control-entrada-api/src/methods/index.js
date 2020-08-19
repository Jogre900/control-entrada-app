import models from "@models";
import multer from "multer";
import { encrypt } from "@utils/security";

const Methods = {
  //test
  test: function(req, res) {
    res.status(200).send(`<h2>Hola desde Node</h2>`);
  },
  createUser: async function(req, res) {
    let user = await models.User.create({
      name: req.body.name,
      lastName: req.body.lastName,
      dni: req.body.dni,
      email: req.body.email,
      password: req.body.password
    });
    //   if (user) {
    //     let mailOptions = {
    //       from: 'Segovia Develop 👻" <segoviadevelop@gmail.com>',
    //       to: req.body.email,
    //       subject: "Sending Email using Node.js - Control Entrada",
    //       text: "That was easy!",
    //       html:
    //         "<h1>Hello " +
    //         user.email +
    //         "</h1><br />Your Pin: " +
    //         user.pin +
    //         " and token validate " +
    //         user.tokenActivation
    //     };
    //     sendMail(mailOptions);
    //   }
    res.json({ msg: user });
  },
  findUsers: async function(req, res) {
    let user = await models.User.findAll({
      include: [
        {
          model: models.NotificationRead,
          as: "notificationUsers",
          include: { model: models.Notification, as: "notification" }
        }
      ]
    });
    res.json({ msg: user });
  },
  createNoti: async function(req, res) {
    let user = await models.User.findByPk(req.body.id);

    let notificationInput = {
      notificationType: "Give",
      notification:
        "#title: Oh! parece que alguien te hizo un obsequio. #body: Que afortunado eres " +
        user.email +
        ", te acaba de obsequiar una oferta. Podrás acceder a tu regalo luego de haber aceptado. #action: ",
      notificationRead: [
        {
          userId: user.id
        }
      ]
    };

    let notification = await models.Notification.create(
      {
        ...notificationInput
      },
      {
        include: [
          {
            model: models.NotificationRead,
            as: "notificationRead"
          }
        ]
      }
    );

    res.json({
      msg: notification
    });
  },
  logIn: async function(req, res) {
    let response = { value: "", error: false, msg: "" };
    // random endpoint so that the client can call something
    let user = await models.User.findOne({
      where: {
        email: req.body.email,
        password: encrypt(req.body.password)
      }
    });

    if (user) {
      response.value = user;
    } else {
      response.error = true;
      response.msg = "Usuario Invalido!";
    }
    res.json(response);
  }
};

module.exports = Methods;
