import models from "@models";
import { encrypt } from "@utils/security";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { $security, $serverPort } from "@config";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

const Methods = {
  createCompany: async function(req, res) {
    const { name, email, dni, zone } = req.body;
    let company = await models.company.create({
      name,
      email,
      dni
    });
    res.json({ msg: company });
  },
  createZone: async function(req, res) {
    const { zone } = req.body;
    const { id } = req.params;
    console.log("company id--------------------", id);
    let zoneC = await models.zone.create({
      zone,
      companyId: id
    });
    res.json({ msg: zoneC });
  },
  findZones: async function(req, res) {
    let zones = await models.zone.findAll({
      include: [
        { model: models.company },
        { model: models.destination, as: "Destinos" },
        { model: models.userZone, as: "encargado_zona" }
      ]
    });
    res.json({ msg: zones });
  },
  createDestiny: async function(req, res) {
    const { name } = req.body;
    const { id } = req.params;
    let destiny = await models.destination.create({
      name,
      zoneId: id
    });
    res.json({ msg: destiny });
  },
  findDestinyByZone: async function(req, res) {
    const { id } = req.params;
    let zones = await models.destination.findAll({
      where: {
        zoneId: id
      },
      include: [{ model: models.zone, as: "Zone" }]
    });
    res.json({ msg: zones });
  },
  createEmployee: async function(req, res) {
    console.log("empleado----", req.body);
    const {
      name,
      lasName,
      dni,
      picture,
      status,
      assignationDate,
      changeTurnDate,
      ZoneId,
      companyId,
      userId
    } = req.body;
    let employeeData = {
      name,
      lasName,
      dni,
      picture,
      status,
      companyId
    };
    let userZoneData = {
      assignationDate,
      changeTurnDate,
      ZoneId
    };
    let employee = await models.employee.create(
      {
        ...employeeData,
        Horario: {
          ...userZoneData
        }
      },
      { include: [{ model: models.userZone, as: "Horario" }] }
    );
    res.json({ msg: employee });
  },
  createUserZone: async function(req, res) {
    const { assignationDate, changeTurnDate, ZoneId, EmployeeId } = req.body;
    console.log("userZone", req.body);
    let userZone = await models.userZone.create({
      assignationDate,
      changeTurnDate,
      ZoneId,
      EmployeeId
    });
    res.json({ msg: userZone });
  },
  findEmployees: async function(req, res) {
    let employees = await models.employee.findAll({
      include: [{ model: models.userZone, as: "alog" }]
    });
    res.json({ msg: employees });
  },
  uploadImage: async function(req, res, next) {
    console.log(req.body);
    const file = req.file;
    console.log(file);
    const { entry } = req.body;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    let data = await models.picture.create({
      picture: file.filename,
      entry
    });
    //retornar el nombre del archivo para guardar en la base de datos
    res.send({ msg: data });
    //res.send(file.filename);
  },
  displayPicture: async function(req, res) {
    let data = await models.picture.findAll();
    res.send({ msg: data });
  },
  createUser: async function(req, res) {
    console.log(req.body);
    let { name, lastName, dni, email, password } = req.body;
    let user = await models.User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      let hash = await bcrypt.hash(password, 10);
      console.log("hash:---", hash);
      password = hash;
      console.log("password:-----", password);
      let userR = await models.User.create({
        name,
        lastName,
        dni,
        email,
        password
      });

      let token = jwt.sign(userR.dataValues, SECRETKEY, { expiresIn: 1440 });
      res.json({
        msg: "Registro exitoso",
        tkn: token
      });
    } else {
      res.json({ msg: "usuario ya registrado" });
    }

    // let user = await models.User.create({
    //   name: req.body.name,
    //   lastName: req.body.lastName,
    //   dni: req.body.dni,
    //   email: req.body.email,
    //   password: req.body.password
    // });
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

    // console.log(user);
    // res.json({ msg: user });
  },
  login: async function(req, res) {
    const { email, password } = req.body;
    console.log(req.body);
    let user = await models.User.findOne({
      where: {
        email
      }
    });
    if (user) {
      console.log("user:----", user);
      console.log("password:----", password);
      console.log("user.password:----", user.password);
      if (bcrypt.compareSync(password, user.password)) {
        console.log("si paso!!!");
        let token = jwt.sign(user.dataValues, SECRETKEY, { expiresIn: 1440 });
        res.json({
          msg: "Inicio Exitoso",
          tokn: token
        });
      } else {
        res.json({ msg: "Usuario no Registrado" });
      }
    }else {
      res.json({ msg: "Correo no registrado" });
    }
  },
  getProfile: async function(req, res){
    let decode = jwt.verify(req.header['authorization'], SECRETKEY)
    console.log("decode",decode)
    let profile = await models.User.findOne({
      where: {
        id: decode.id
      }
    })
    if(profile) res.json({profile: user})
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
