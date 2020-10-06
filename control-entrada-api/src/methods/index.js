import models from "@models";
import { encrypt } from "@utils/security";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { $security, $serverPort } from "@config";
import options from "dotenv/lib/env-options";
import moment from "moment";
import { Op } from "sequelize";
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
    const { zone, firsEntryTime, firsDepartureTime } = req.body;
    const { id } = req.params;
    console.log(req.body);
    try {
      let zoneC = await models.zone.create({
        zone,
        firsEntryTime,
        firsDepartureTime,
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
      let zones = await models.zone.findAll({
        include: [
          //{ model: models.company, as: "companyZone" },
          { model: models.destination, as: "Destinos" },
          {
            model: models.userZone,
            as: "encargado_zona",
            include: [models.User]
          }
        ]
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa!";
      RESPONSE.data = zones;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.error = error;
      res.json(RESPONSE);
    }
  },
  deleteZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      let zone = await models.zone.findOne({
        where: {
          id
        }
      });
      if (zone) {
        console.log(zone);
        zone.destroy();
        (RESPONSE.error = false), (RESPONSE.msg = "Registro borrado!");
        RESPONSE.data = zone;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
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
  deleteDestiny: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      let destiny = await models.destination.findOne({
        where: {
          id
        }
      });
      if (destiny) {
        destiny.destroy();
        (RESPONSE.error = false), (RESPONSE.msg = "Registro borrado!");
        RESPONSE.data = destiny;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
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
    console.log(req.body);
    console.log(req.params);
    let {
      name,
      lastName,
      dni,
      email,
      password,
      privilege,
      assignationDate,
      changeTurnDate
    } = req.body;
    const { id } = req.params;
    console.log(req.file);
    try {
      let user = await models.User.findOne({
        where: {
          email
        }
      });
      console.log("user", user);
      if (user == null) {
        try {
          //console.log("es null")
          //console.log(password)
          let hash = await bcrypt.hash(password, 10);
          password = hash;
          let userR = await models.User.create(
            {
              name,
              lastName,
              dni,
              email,
              password,
              picture: req.file.filename,
              privilege,
              userZone: {
                assignationDate,
                changeTurnDate,
                ZoneId: id
              }
            },
            {
              include: [{ model: models.userZone, as: "userZone" }]
            }
          );
          //console.log(userR)

          //let token = jwt.sign(userR.dataValues, SECRETKEY, { expiresIn: 1440 });
          RESPONSE.error = false;
          RESPONSE.msg = "Registro Exitoso!";
          RESPONSE.data = userR;
          //RESPONSE.token = token;
          res.json(RESPONSE);
        } catch (error) {
          console.log(error);
        }
      } else {
        RESPONSE.error = true;
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
          let token = jwt.sign(user.dataValues, SECRETKEY, { expiresIn: "1d" });
          RESPONSE.error = false;
          RESPONSE.msg = "Inicio Exitoso";
          RESPONSE.data = user;
          RESPONSE.token = token;
        } else {
          RESPONSE.msg = "Clave Invalida";
          res.status(401).json(RESPONSE)
        }
      } else {
        RESPONSE.msg = "Usuario no registrado";
        res.status(404).json(RESPONSE)
      }
      res.status(200).json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
      res.status(500).json(RESPONSE);
    }
  },
  getProfile: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };

    const token = req.headers.authorization.split(" ")[1];

    let decode = jwt.verify(token, SECRETKEY);
    try {
      let profile = await models.User.findOne({
        where: {
          id: decode.id
        }
      });
      if (profile) {
        RESPONSE.error = false;
        RESPONSE.data = profile;
        RESPONSE.msg = "Perfil Encontrado";
        res.json(RESPONSE);
      } else {
        RESPONSE.msg = "Token no valido";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.error = error;
      res.json(RESPONSE);
    }
  },
  findUserZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      let userZone = await models.userZone.findOne({
        where: {
          UserId: id
        },

        include: [
          {
            model: models.zone,
            include: {
              model: models.destination,
              as: "Destinos"
            }
          }
        ]
      });
      if (userZone) {
        (RESPONSE.error = false),
          (RESPONSE.msg = "Busqueda exitosa!"),
          (RESPONSE.data = userZone);
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  verifyExpToken: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const token = req.headers.authorization.split(" ")[1];
    try {
      let decode = jwt.verify(token, SECRETKEY);
      if (decode) {
        if (decode.exp) {
          RESPONSE.error = false;
          (RESPONSE.data = decode), (RESPONSE.msg = "token activo");
          RESPONSE.token = decode;
          res.json(RESPONSE);
        }
      }
    } catch (error) {
      RESPONSE.msg = error;
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
          },
          {
            model: models.userZone,
            as: "userZone",
            include: {
              model: models.zone
            }
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
  deleteUser: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      let user = await models.User.findOne({
        where: {
          id
        }
      });
      if (user) {
        user.destroy();
        (RESPONSE.error = false), (RESPONSE.msg = "Registro Borrado!");
        RESPONSE.data = user;
        res.json(RESPONSE);
      }
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
    console.log(req.body);
    console.log(req.params);
    console.log(req.file);
    const {
      dni,
      name,
      lastName,
      entryDate,
      descriptionEntry,
      departureDate,
      descriptionDeparture,
      userZoneId
    } = req.body;
    const { id } = req.params;
    try {
      let visits = await models.citizen.create(
        {
          dni,
          name,
          lastName,
          picture: req.file.filename,
          Visitas: {
            entryDate,
            descriptionEntry,
            departureDate,
            descriptionDeparture,
            destinationId: id,
            UserZoneId: userZoneId
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
  updateVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { departureDate, descriptionDeparture } = req.body;
    const { id } = req.params;

    try {
      let visit = await models.visits.findOne({
        where: {
          id
        }
      });
      if (visit) {
        console.log(visit);
        visit.departureDate = departureDate;
        visit.descriptionDeparture = descriptionDeparture;
        await visit.save();
        console.log(visit);
        RESPONSE.error = false;
        RESPONSE.msg = "Actualizacion Existosa";
        RESPONSE.data = visit;
        res.json(RESPONSE);
      }
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
        where: { dni: id },
        include: [
          {
            model: models.visits,
            as: "Visitas",
            include: [
              { model: models.destination },
              {
                model: models.userZone,
                include: [{ model: models.zone }, { model: models.User }]
              }
            ]
          }
        ]
      });
      if (visit) {
        console.log(visit);
        RESPONSE.error = false;
        RESPONSE.msg = "Consulta Exitosa";
        RESPONSE.data = visit;

        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  findTodayVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { date } = req.params;

    console.log(req.params);
    try {
      let visits = await models.visits.findAll({
        where: {
          entryDate: {
            [Op.between]: [
              `${moment().format("YYYY-MM-DD")} 00:00:00`,
              `${moment().format("YYYY-MM-DD")} 23:59:00`
            ]
          }
        },
        include: [
          { model: models.citizen },
          { model: models.destination, attributes: ["id", "name"] },
          {
            model: models.userZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              { model: models.zone, attributes: ["id", "zone"] },
              {
                model: models.User,
                attributes: [
                  "id",
                  "name",
                  "lastName",
                  "dni",
                  "email",
                  "picture"
                ]
              }
            ]
          }
        ]
      });
      console.log("res:-------", visits);
      if (visits) {
        (RESPONSE.error = false), (RESPONSE.msg = "Busqueda exitosa!");
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  findTodayVisitsByUser: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { id } = req.params;
    try {
      let visits = await models.visits.findAll({
        where: {
          UserZoneId: id,
          entryDate: {
            [Op.between]: [
              `${moment().format("YYYY-MM-DD")} 00:00:00`,
              `${moment().format("YYYY-MM-DD")} 23:59:00`
            ]
          }
        },
        include: [
          { model: models.citizen },
          { model: models.destination, attributes: ["id", "name"] },
          {
            model: models.userZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              { model: models.zone, attributes: ["id", "zone"] },
              {
                model: models.User,
                attributes: [
                  "id",
                  "name",
                  "lastName",
                  "dni",
                  "email",
                  "picture"
                ]
              }
            ]
          }
        ]
      });
      console.log(visits)
    } catch (error) {
      console.log(error)
    }
  },
  findWeekVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };

    try {
      let visits = await models.visits.findAll({
        where: {
          entryDate: {
            [Op.between]: [
              moment()
                .subtract(7, "days")
                .calendar(),
              `${moment().format("YYYY-MM-DD")} 23:59:00`
            ]
          }
        },
        include: [
          { model: models.citizen },
          { model: models.destination, attributes: ["id", "name"] },
          {
            model: models.userZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              { model: models.zone, attributes: ["id", "zone"] },
              {
                model: models.User,
                attributes: [
                  "id",
                  "name",
                  "lastName",
                  "dni",
                  "email",
                  "picture"
                ]
              }
            ]
          }
        ]
      });
      console.log("res:-------", visits);
      if (visits) {
        (RESPONSE.error = false), (RESPONSE.msg = "Busqueda exitosa!");
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
      res.json(RESPONSE);
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
