import models from "@models";
import { encrypt } from "@utils/security";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { $security, $serverPort } from "@config";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

const Methods = {
  createCompany: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { name, email, dni } = req.body;
    try {
      let company = await models.company.create({
        name,
        email,
        dni
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Creacion de Empresa Exitoso!";
      RESPONSE.data = company;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  findCompany: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    try {
      let company = await models.company.findAll();
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa";
      RESPONSE.data = company;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  createZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { zone } = req.body;
    const { id } = req.params;
    try {
      let zoneC = await models.zone.create({
        zone,
        companyId: id
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Creacion de Zona Exitasa!";
      RESPONSE.data = zoneC;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
    }
  },
  findZones: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    try {
       let zones = await models.zone.findAll(
         {
        include: [
          //{ model: models.company, as: "companyZone" },
          { model: models.destination, as: "Destinos" },
          { model: models.userZone, as: "encargado_zona" }
        ]
      }
      );
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa!";
      RESPONSE.data = zones;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.error = error;
      res.json(RESPONSE);
    }
  },
  createDestiny: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { name } = req.body;
    const { id } = req.params;
    try {
      let destiny = await models.destination.create({
        name,
        zoneId: id
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Creacion de Destino Exitosa!";
      RESPONSE.data = destiny;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  findDestinyByZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      let destinys = await models.destination.findAll({
        where: {
          zoneId: id
        },
        include: [{ model: models.zone, as: "Zone" }]
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa!";
      RESPONSE.data = destinys;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
    }
  },
  createEmployee: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const {
      name,
      lastName,
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
      lastName,
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
    try {
      let employee = await models.employee.create(
        {
          ...employeeData,
          Horario: {
            ...userZoneData
          }
        },
        { include: [{ model: models.userZone, as: "Horario" }] }
      );
      RESPONSE.error = false;
      RESPONSE.msg = "Creacion de Empleado Exitosa!";
      RESPONSE.data = employee;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  createUserZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { assignationDate, changeTurnDate, ZoneId } = req.body;
    const { id } = req.params;
    try {
      let userZone = await models.userZone.create({
        assignationDate,
        changeTurnDate,
        ZoneId,
        EmployeeId: id
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Creacion de UserZone Exitosa!";
      RESPONSE.data = userZone;
      res.json({ msg: userZone });
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  findEmployees: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    try {
      let employees = await models.employee.findAll({
        include: [{ model: models.userZone, as: "Horario" }]
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa!";
      RESPONSE.data = employees;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
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
    // let data = await models.picture.create({
    //   picture: file.filename,
    //   entry
    // });
    //retornar el nombre del archivo para guardar en la base de datos
    //res.send({ msg: data });
    //res.send(file.filename);
    return file;
  },
  displayPicture: async function(req, res) {
    let data = await models.picture.findAll();
    res.send({ msg: data });
  },
  createUser: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    let { name, lastName, dni, email, password } = req.body;
    try {
      let user = await models.User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (!user) {
        let hash = await bcrypt.hash(password, 10);
        password = hash;
        let userR = await models.User.create({
          name,
          lastName,
          dni,
          email,
          password
        });

        let token = jwt.sign(userR.dataValues, SECRETKEY, { expiresIn: 1440 });
        RESPONSE.error = false;
        RESPONSE.msg = "Registro Exitoso!";
        RESPONSE.data = userR;
        RESPONSE.token = token;
        res.json(RESPONSE);
      } else {
        RESPONSE.msg = "Usuario ya Registrado";
        RESPONSE.data = user;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
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
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { email, password } = req.body;
    try {
      let user = await models.User.findOne({
        where: {
          email
        }
      });
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          let token = jwt.sign(user.dataValues, SECRETKEY, { expiresIn: 1440 });
          RESPONSE.error = false;
          RESPONSE.msg = "Inicio Exitoso";
          RESPONSE.data = user;
          RESPONSE.token = token;
        } else {
          RESPONSE.msg = "Usuario no Registrado";
        }
      } else {
        RESPONSE.msg = "Correo no registrado";
      }
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  getProfile: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    let decode = jwt.verify(req.headers.authorization, SECRETKEY);
    try {
      let profile = await models.User.findOne({
        where: {
          id: decode.id
        }
      });
      if (profile) {
        RESPONSE.error = false;
        RESPONSE.data = profile;
      } else {
        RESPONSE.msg = "Token no valido";
      }

      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.error = error;
      res.json(RESPONSE);
    }
  },
  findUsers: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    try {
      let user = await models.User.findAll({
        include: [
          {
            model: models.NotificationRead,
            as: "notificationUsers",
            include: { model: models.Notification, as: "notification" }
          }
        ]
      });
      (RESPONSE.error = false), (RESPONSE.msg = "Busqueda Exitosa");
      RESPONSE.data = user;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  createVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    let picture = req.file.filename;

    const {
      dni,
      name,
      lastName,
      entryDate,
      descriptionEntry,
      departureDate,
      descriptionDeparture
    } = req.body;
    try {
      let visits = await models.citizen.create(
        {
          dni,
          name,
          lastName,
          picture,
          Visitas: {
            entryDate,
            descriptionEntry,
            departureDate,
            descriptionDeparture
          }
        },
        {
          include: [
            {
              model: models.visits,
              as: "Visitas"
            }
          ]
        }
      );
      (RESPONSE.error = false), (RESPONSE.msg = "Registro Exitoso");
      RESPONSE.data = visits;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  findVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { id } = req.params;
    try {
      let visit = await models.citizen.findOne({
        where: { id },
        include: [{ model: models.visits, as: "Visitas" }]
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Consulta Exitosa";
      RESPONSE.data = visit;

      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
    }
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
