import models from "@models";
import { encrypt } from "@utils/security";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { $security, $serverPort } from "@config";
import options from "dotenv/lib/env-options";
import moment from "moment";
import { Op, fn, col, literal } from "sequelize";
import { Expo } from 'expo-server-sdk';
import fetch from 'node-fetch'

const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

//PRUEBA DE PUSH N
let expo = new Expo();

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'HOLA OMAIRA',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
//---------->
const sendPush = async (pushToken) => {
  let messages = []
  messages.push({
    to: pushToken,
    sound: 'default',
    body: 'This is a test notification',
    data: { withSome: 'data' },
  })
  try {
    let resPush = await expo.sendPushNotificationsAsync(messages);
    return console.log("RES DE SENDP--",resPush);
    // NOTE: If a ticket contains an error code in ticket.details.error, you
    // must handle it appropriately. The error codes are listed in the Expo
    // documentation:
    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
  } catch (error) {
    console.error(error);
  }
}

//FIN PRUEBA DE PUSH N


const Controllers = {
  createAdmin: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { name, lastName, dni, email, password, privilege } = req.body;
    console.log(req.body);
    console.log(req.file);
    try {
      let admin = await models.Admin.create({
        name,
        lastName,
        dni,
        email,
        password,
        picture: req.file.filename,
        privilege
      });
      let token = jwt.sign(admin.dataValues, SECRETKEY, {
        expiresIn: "1d"
      });
      (RESPONSE.error = false), (RESPONSE.msg = "Registro Exitoso!");
      (RESPONSE.data = admin), (RESPONSE.token = token);
      res.status(200).json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  saveDeviceToken: async function(req, res){
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params
    const { token } = req.body
    console.log(req.params, req.body)
    try {
      const newToken = await models.Token.create({
        token: token,
        userId: id
      })
      if(newToken){
        RESPONSE.error = false
        RESPONSE.msg = 'Guardado de Token Exitoso!'
        RESPONSE.data = newToken
        console.log(RESPONSE)
        res.json(RESPONSE)
      }
    } catch (error) {
      RESPONSE.msg = error.message
      res.json(RESPONSE)
    }
  },
  findAdmin: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
  },
  createCompany: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    /**
     * companyName
businessName
nic
city
address
phoneNumber
phoneNumberOther
logo
active-def true

dni
name
lastName
picture
status-no

email
password

privilege

companyName: "Test Company,
businessName: "Test Company C.A.,
nic: "9453145-451,
city: "San Juan,
address: "Calle del medio,
phoneNumber: "+58 426 1414253,
phoneNumberOther: ",
dni: "19760800,
name: "Jose,
lastName: "Segovia,
email: "j@gmail.com,
password: "123456,
     */
    const {
      companyName,
      businessName,
      nic,
      city,
      address,
      phoneNumber,
      phoneNumberOther,
      visits,
      dni,
      name,
      lastName,
      email,
      password
    } = req.body;

    console.log("CREATE ADMIN", req.body);
    console.log("FOTO ADMIN", req.files);
    try {
      let checkEmail = await models.User.findOne({
        where: {
          email: email.toLowerCase()
        }
      });

      if (checkEmail) {
        RESPONSE.msg = "Este correo ya se encuentra registrado en una empresa";
        res.json(RESPONSE);
      }

      let newPass = await bcrypt.hash(password, 10);
      let inputUser = {
        email: email.toLowerCase(),
        password: newPass,
        Employee: {
          dni,
          name,
          lastName,
          picture: req.files[0].filename,
          status: "Active"
        }
      };

      let NewUser = await models.User.create(
        { ...inputUser },
        {
          include: {
            model: models.Employee,
            as: "Employee"
          }
        }
      );

      let inputCompany = {
        companyName,
        businessName,
        nic,
        city,
        address,
        phoneNumber
      };

      if (req.files.length > 1) {
        inputCompany.logo = req.files[1].filename;
      }

      if (phoneNumberOther) {
        inputCompany.phoneNumberOther = phoneNumberOther;
      }

      let newCompany = await models.Company.create({ ...inputCompany });

      let inputUserCompany = {
        companyId: newCompany.id,
        userId: NewUser.id,
        privilege: "Admin",
        visits: 0
      };

      if (NewUser && newCompany) {
        let userCompany = await models.UserCompany.create({
          ...inputUserCompany
        });

        if (userCompany) {
          RESPONSE.error = false;
          RESPONSE.msg = "Registro Exitoso!";
          RESPONSE.data = NewUser;
          res.json(RESPONSE);
        }
      }
    } catch (error) {
      console.log(error);
      RESPONSE.msg = error.message;
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

    const { id } = req.params;
    try {
      let company = await models.UserCompany.findOne({
        where: {
          userId: id
        },
        include: [
          {
            model: models.Company,
            as: "Company"
          }
        ]
      });
      if (company) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa";
        RESPONSE.data = company;
        res.json(RESPONSE);
      }
    } catch (error) {
      console.log(error);
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
    const {
      zone,
      firsEntryTime,
      firsDepartureTime,
      SecondEntryTime,
      SecondDepartureTime,
      destiny
    } = req.body;
    const { id } = req.params;
    console.log(req.body);
    console.log(req.params);
    try {
      let inputZone = {
        zone,
        companyId: id,
        visits: 0
      };

      if (firsEntryTime) {
        inputZone.firsEntryTime = firsEntryTime;
      }

      if (firsDepartureTime) {
        inputZone.firsDepartureTime = firsDepartureTime;
      }

      if (SecondEntryTime) {
        inputZone.SecondEntryTime = SecondEntryTime;
      }

      if (SecondDepartureTime) {
        inputZone.SecondDepartureTime = SecondDepartureTime;
      }

      let zoneC = await models.Zone.create({
        ...inputZone
      });
      if (zoneC) {
        const destinyC = await models.Destination.create({
          name: destiny,
          zoneId: zoneC.dataValues.id,
          visits: 0
        });
        if (destinyC) {
          RESPONSE.error = false;
          RESPONSE.msg = "Creacion de Zona Exitosa!";
          RESPONSE.data = zoneC;
          res.json(RESPONSE);
        }
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { zoneId } = req.params;
    console.log(zoneId);
    try {
      let zones = await models.Zone.findOne({
        where: {
          id: zoneId
        },
        include: [
          { model: models.Destination, as: "Destinos" },
          {
            model: models.UserZone,
            as: "encargado_zona",
            include: {
              model: models.User,
              as: "User",
              include: [
                { model: models.Employee, as: "Employee" },
                { model: models.UserCompany, as: "UserCompany" }
              ]
            }
          }
        ]
      });
      //await sendPush('ExponentPushToken[sBb32gExCmzzS2BJZL7bJm]')
      const push = await sendPushNotification('ExponentPushToken[sBb32gExCmzzS2BJZL7bJm]')
      console.log("push----",push)
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa!";
      RESPONSE.data = zones;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findZones: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { companyId } = req.params;
    try {
      let zones = await models.Zone.findAll({
        where: {
          companyId
        },
        include: [
          { model: models.Destination, as: "Destinos" },
          {
            model: models.UserZone,
            as: "encargado_zona",
            include: {
              model: models.User,
              as: "User",
              include: [
                { model: models.Employee, as: "Employee" },
                { model: models.UserCompany, as: "UserCompany" }
              ]
            }
          }
        ]
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa!";
      RESPONSE.data = zones;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findZoneMaxVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { companyId } = req.params;
    try {
      const zones = await models.Zone.findAll({
        where: {
          companyId
        }
      });
      if (zones) {
        const zoneMaxV = zones.reduce((prev, elem) =>
          prev.visits > elem.visits ? prev : elem
        );
        RESPONSE.error = false;
        RESPONSE.data = zoneMaxV;
        RESPONSE.msg = "Busqueda exitosa!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
    console.log(req.params);
    let array = [];
    if (id.length > 36) {
      array = id.split(",");
    }
    try {
      const zones = await models.Zone.findAll({
        where: {
          id: array.length > 0 ? array : id
        },
        include: {
          model: models.UserZone,
          as: "encargado_zona"
        }
      });
      if (zones) {
        let deleted = true;
        zones.map(({ dataValues }) => {
          if (dataValues.encargado_zona.length > 0) {
            deleted = false;
            return;
          }
        });
        if (deleted) {
          const deleteZones = await models.Zone.destroy({
            where: {
              id: array.length > 0 ? array : id
            }
          });
          RESPONSE.error = false;
          RESPONSE.msg = "Borrado Exitoso!";
          RESPONSE.data = deleteZones;
          res.json(RESPONSE);
        } else {
          RESPONSE.msg =
            "Error al Borrar, la(s) zona(s) posee personal asignado.";
          RESPONSE.data = zones;
          res.json(RESPONSE);
        }
      }

      let trabajadores = [];
      let trabajadoresId = [];
      //console.log("zone*-------", zones);
      // if (userZones.length > 0) {
      //   trabajadores = userZones.map(uz => uz.User);
      //   console.log("trabajadores---", trabajadores);

      //   trabajadores.map(async trabajador => {
      //     (trabajador.privilege = "Available"), await u.save();
      //   });
      //   userZones.map(async uz => await uz.destroy());
      //   zones.map(async zone => await zone.destroy());
      //   RESPONSE.error = false;
      //   RESPONSE.msg = "Registro borrado!";
      //   RESPONSE.data = usersToUpdate;
      //   res.json(RESPONSE);
      // } else {
      //   console.log("zona sin encargados!!!!");
      //   zones.map(async zone => await zone.destroy());
      //   RESPONSE.error = false;
      //   RESPONSE.msg = "Registro borrado!";
      //   RESPONSE.data = zones;
      //   res.json(RESPONSE);
      // }
    } catch (error) {
      RESPONSE.msg = error.message;
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
      let destiny = await models.Destination.create({
        name,
        zoneId: id,
        visits: 0
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Creacion de Destino Exitosa!";
      RESPONSE.data = destiny;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error.message;
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
    console.log(req.params);
    try {
      let destinys = await models.Destination.findAll({
        where: {
          zoneId: id
        },
        include: [{ model: models.Zone, as: "Zona" }]
      });

      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa!";
      RESPONSE.data = destinys;
      res.json(RESPONSE);
    } catch (error) {
      console.log(error);
      RESPONSE.msg = error.message;
    }
  },
  findAllDestiny: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      const zones = await models.Zone.findAll({
        where: {
          companyId: id
        },
        include: {
          model: models.Destination,
          as: "Destinos"
        }
      });
      if (zones) {
        let zoneIDArray = [];
        zones.map(({ dataValues }) => {
          zoneIDArray.push(dataValues.id);
        });
        const destinos = await models.Destination.findAll({
          where: {
            zoneId: zoneIDArray
          }
        });
        if (destinos) RESPONSE.error = false;
        RESPONSE.MSG = "Busqueda Exitosa!";
        RESPONSE.data = destinos;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findDestinyMaxVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const zoneId = req.body;
    console.log(req.body);
    try {
      const destiny = await models.Destination.findAll({
        where: {
          zoneId
        },
        raw: true
      });
      if (destiny) {
        const maxVisitsD = destiny.reduce((prev, elem) =>
          prev.visits > elem.visits ? prev : elem
        );
        RESPONSE.error = false;
        RESPONSE.data = maxVisitsD;
        RESPONSE.msg = "Busqueda exitosa!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
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
    console.log(id.length);
    let array = [];
    if (id.length > 36) {
      array = id.split(",");
    }

    try {
      const destinys = await models.Destination.findAll({
        where: {
          id: array.length ? array : id
        },
        raw: true
      });
      let deleted = true;
      if (destinys) {
        destinys.map(({ visits }) => {
          if (visits > 0) {
            deleted = false;
            return;
          }
        });
        if (deleted) {
          const destiny = await models.Destination.destroy({
            where: {
              id: array.length ? array : id
            }
          });
          if (destiny) {
            (RESPONSE.error = false), (RESPONSE.msg = "Borrado Exitoso!");
            RESPONSE.data = destiny;
            res.json(RESPONSE);
          }
        } else {
          RESPONSE.msg = "Error, Destino(s) seleccionado(s) posee entradas";
          RESPONSE.data = destinys;
          res.json(RESPONSE);
        }
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
      let employee = await models.Employee.create(
        {
          ...employeeData,
          Horario: {
            ...userZoneData
          }
        },
        { include: [{ model: models.UserZone, as: "Horario" }] }
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
    const {
      assignationDate,
      changeTurnDate,
      zoneId,
      userId,
      privilege
    } = req.body;
    const { id } = req.params;
    console.log(req.body);
    try {
      let userA = await models.User.findOne({
        where: {
          id: userId
        }
      });
      if (userA) {
        console.log(userA);
        userA.privilege = privilege;
        await userA.save();
        let userZone = await models.UserZone.create({
          assignationDate,
          changeTurnDate,
          ZoneId: zoneId,
          UserId: userId
        });
        RESPONSE.error = false;
        RESPONSE.msg = "Creacion de UserZone Exitosa!";
        RESPONSE.data = userZone;
        res.json({ msg: userZone });
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
      let employees = await models.Employee.findAll({
        include: [{ model: models.UserZone, as: "Horario" }]
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
    let data = await models.Picture.findAll();
    res.send({ msg: data });
  },
  createUserWatchman: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    console.log("SOY WATCHMAN", req.body);
    let {
      name,
      lastName,
      dni,
      email,
      password,
      companyId,
      zoneId,
      assignationDate,
      changeTurnDate
    } = req.body;
    const privilege = "Watchman";

    console.log(req.file);
    try {
      let user = await models.User.findOne({
        where: {
          email: email.toLowerCase()
        },
        include: {
          model: models.Employee,
          as: "Employee"
        }
      });

      if (!user) {
        let hash = await bcrypt.hash(password, 10);
        password = hash;

        let inputUser = {
          email: email.toLowerCase(),
          password: hash,
          Employee: {
            name,
            lastName,
            dni,
            //picture: "foto de prueba",
            picture: req.file.filename,
            status: "Active"
          },
          userZone: {
            assignationDate,
            changeTurnDate,
            ZoneId: zoneId
          },
          UserCompany: {
            companyId,
            privilege,
            visits: 0
          }
        };

        let employee = await models.User.create(
          {
            ...inputUser
          },
          {
            include: [
              {
                model: models.UserZone,
                as: "userZone"
              },
              {
                model: models.Employee,
                as: "Employee"
              },
              {
                model: models.UserCompany,
                as: "UserCompany"
              }
            ]
          }
        );
        if (employee) {
          const userC = await models.User.findOne({
            where: {
              id: employee.dataValues.id
            },

            include: [
              {
                model: models.Employee,
                as: "Employee"
              },
              {
                model: models.UserCompany,
                as: "UserCompany"
              },
              {
                model: models.UserZone,
                as: "userZone",
                include: {
                  model: models.Zone,
                  as: "Zona"
                }
              }
            ]
          });
          if (userC) {
            RESPONSE.error = false;
            RESPONSE.msg = "Registro Exitoso!";
            RESPONSE.data = userC;
            res.json(RESPONSE);
          }
        }
      } else {
        RESPONSE.msg = "usuario ya existe";
        RESPONSE.data = user;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
  createUserSupervisor: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    console.log("SOY SUPERVISOR", req.body);
    let {
      name,
      lastName,
      dni,
      email,
      password,
      companyId,
      zoneId,
      assignationDate,
      changeTurnDate
    } = req.body;
    const privilege = "Supervisor";

    console.log(req.file);
    try {
      let user = await models.User.findOne({
        where: {
          email: email.toLowerCase()
        },
        include: {
          model: models.Employee,
          as: "Employee"
        }
      });
      console.log("user", user);

      if (!user) {
        let hash = await bcrypt.hash(password, 10);
        password = hash;

        let inputUser = {
          email: email.toLowerCase(),
          password: hash,
          Employee: {
            name,
            lastName,
            dni,
            picture: req.file.filename,
            //picture: "foto de prueba",
            status: "Active"
          },
          userZone: {
            ZoneId: zoneId,
            assignationDate,
            changeTurnDate
          },
          UserCompany: {
            companyId,
            privilege,
            visits: 0
          }
        };

        let employee = await models.User.create(
          {
            ...inputUser
          },
          {
            include: [
              {
                model: models.Employee,
                as: "Employee"
              },
              {
                model: models.UserZone,
                as: "userZone"
              },
              {
                model: models.UserCompany,
                as: "UserCompany"
              }
            ]
          }
        );

        if (employee) {
          const userC = await models.User.findOne({
            where: {
              id: employee.dataValues.id
            },

            include: [
              {
                model: models.Employee,
                as: "Employee"
              },
              {
                model: models.UserCompany,
                as: "UserCompany"
              },
              {
                model: models.UserZone,
                as: "userZone",
                include: {
                  model: models.Zone,
                  as: "Zona"
                }
              }
            ]
          });
          if (userC) {
            RESPONSE.error = false;
            RESPONSE.msg = "Registro Exitoso!";
            RESPONSE.data = userC;
            res.json(RESPONSE);
          }
        } else {
          RESPONSE.msg = "Error al registrar";
          res.json(RESPONSE);
        }
      } else {
        RESPONSE.error = true;
        RESPONSE.msg = "usuario ya existe";
        RESPONSE.data = user;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
      companyId,
      zoneId,
      assignationDate,
      changeTurnDate
    } = req.body;
    const { privilege } = req.params;
    console.log(req.file);
    try {
      let user = await models.User.findOne({
        where: {
          [Op.or]: [{ email }, { dni }]
        }
      });
      console.log("user", user);
      if (!user) {
        let hash = await bcrypt.hash(password, 10);
        password = hash;
        if (privilege === "Admin") {
          let admin = await models.User.create({
            name,
            lastName,
            dni,
            email,
            password,
            picture: req.file.filename,
            privilege
          });
          let token = jwt.sign(admin.dataValues, SECRETKEY, {
            expiresIn: "1d"
          });
          (RESPONSE.error = false), (RESPONSE.msg = "Registro Exitoso!");
          (RESPONSE.data = admin), (RESPONSE.token = token);
          res.status(200).json(RESPONSE);
        } else {
          let employee = await models.User.create(
            {
              name,
              lastName,
              dni,
              email,
              password,
              picture: req.file.filename,
              privilege,
              companyId,
              userZone: {
                assignationDate,
                changeTurnDate,
                ZoneId: zoneId
              }
            },
            {
              include: {
                model: models.UserZone,
                as: "userZone"
              }
            }
          );

          (RESPONSE.error = false), (RESPONSE.msg = "Registro Exitoso!");
          (RESPONSE.data = employee), res.status(200).json(RESPONSE);
        }
      } else {
        RESPONSE.msg = "usuario ya existe";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
    console.log(req.body);
    //console.log(email, password)
    try {
      const user = await models.User.findOne({
        where: {
          email: email.toLowerCase()
        },
        include: [
          {
            model: models.NotificationRead,
            as: "notificationUsers",
            include: { model: models.Notification, as: "notification" }
          },
          {
            model: models.UserZone,
            as: "userZone",
            include: {
              model: models.Zone,
              as: "Zona",
              include: { model: models.Destination, as: "Destinos" }
            }
          },
          {
            model: models.Employee,
            as: "Employee"
          },
          {
            model: models.UserCompany,
            as: "UserCompany",
            include: {
              model: models.Company,
              as: "Company",
              where: {
                active: true
              }
            }
          }
        ]
      });
      let tokenInput = {};
      if (user) {
        if (user.dataValues.UserCompany[0].active === false) {
          RESPONSE.msg = "Cuenta Suspendida";
          res.json(RESPONSE);
        } else {
          if (bcrypt.compareSync(password, user.password)) {
            tokenInput.userId = user.dataValues.id;
            tokenInput.active = user.dataValues.UserCompany[0].active;
            tokenInput.privilege = user.dataValues.UserCompany[0].privilege;
            let token = jwt.sign(tokenInput, SECRETKEY, { expiresIn: "1d" });
            RESPONSE.error = false;
            RESPONSE.msg = "Inicio Exitoso";
            RESPONSE.data = user;
            RESPONSE.token = token;
            res.json(RESPONSE);
          } else {
            RESPONSE.msg = "Clave o Usuario Invalido";
            res.json(RESPONSE);
          }
        }
      } else {
        RESPONSE.msg = "Usuario no registrado.";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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

    const token = req.headers.authorization.split(" ")[1];

    let decode = jwt.verify(token, SECRETKEY);
    try {
      let profile = await models.User.findOne({
        where: {
          id: decode.id
        },
        include: [
          {
            model: models.NotificationRead,
            as: "notificationUsers",
            include: { model: models.Notification, as: "notification" }
          },
          {
            model: models.UserZone,
            as: "userZone",
            include: {
              model: models.Zone,
              include: { model: models.Destination, as: "Destinos" }
            }
          }
        ]
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
  updateAdminId: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.body;
    const { companyId } = req.params;
    console.log(req.body);
    console.log(req.params);
    try {
      let admin = await models.User.findOne({
        where: {
          id
        }
      });
      if (admin) {
        admin.companyId = companyId;
        await admin.save();
        RESPONSE.error = false;
        RESPONSE.msg = "Registro actualizado!";
        RESPONSE.data = admin;
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  updateProfile: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    console.log("UPDATE PROFILE----");
    const { id } = req.params;
    const { password, nic, address, city, number, numberTwo, profile, logo } = req.body;

    console.log(req.params);
    console.log(req.body);
    console.log(req.files);
    try {
      let user = await models.User.findOne({
        include: [
          {
            model: models.Employee,
            as: "Employee",
            where: {
              id
            }
          },
          {
            model: models.UserZone,
            as: "userZone",
            include: {
              model: models.Zone,
              as: "Zona",
              include: {
                model: models.Destination,
                as: "Destinos"
              }
            }
          },
          {
            model: models.UserCompany,
            as: "UserCompany",
            include: {
              model: models.Company,
              as: "Company"
            }
          }
        ]
      });
      console.log(user.UserCompany[0].privilege);

      if (req.files.length > 1 && profile) {
        user.Employee.picture = req.files[0].filename;
        await user.Employee.save();
      }else if(profile){
        user.Employee.picture = req.files[0].filename;
        await user.Employee.save();
      }

      if (password) {
        let hash = await bcrypt.hash(password, 10);
        user.password = hash;
        await user.save();
      }

      if (user.UserCompany[0].privilege === "Admin") {
        if (req.files.length > 1 && logo) {
          user.UserCompany[0].Company.logo = req.files[1].filename;
          await user.UserCompany[0].Company.save();
        }else if(logo){
          user.UserCompany[0].Company.logo = req.files[0].filename;
          await user.UserCompany[0].Company.save();
        }
        if (nic) {
          user.UserCompany[0].Company.nic = nic;
          await user.UserCompany[0].Company.save();
        }
        if (address) {
          user.UserCompany[0].Company.address = address;
          await user.UserCompany[0].Company.save();
        }
        if (city) {
          user.UserCompany[0].Company.city = city;
          await user.UserCompany[0].Company.save();
        }
        if (number) {
          user.UserCompany[0].Company.phoneNumber = number;
          await user.UserCompany[0].Company.save();
        }
        if (numberTwo) {
          user.UserCompany[0].Company.phoneNumberOther = numberTwo;
          await user.UserCompany[0].Company.save();
        }
      }
      
      RESPONSE.error = false;
      RESPONSE.msg = "Datos actualizados!";
      RESPONSE.data = user;
      res.status(200).json(RESPONSE);
    } catch (error) {
      console.log(error.message);
      RESPONSE.msg = error;
      res.json(RESPONSE);
    }
  },
  recoverPassword: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { email } = req.params;
    const { password } = req.body;
    try {
      const user = await models.User.findOne({
        where: {
          email: email.toLowerCase()
        }
      });

      if (user) {
        const newPassword = await bcrypt.hash(password, 10);
        user.password = newPassword;
        await user.save();

        RESPONSE.error = false;
        RESPONSE.msg = "Cambio de clave Exitoso!";
        RESPONSE.data = user;
        res.status(200).json(RESPONSE);
      } else {
        RESPONSE.msg = "Usuario no registrado";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error;
      res.status(500).json(RESPONSE);
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
      let userZone = await models.UserZone.findOne({
        where: {
          UserId: id
        },

        include: [
          {
            model: models.Zone,
            include: {
              model: models.Destination,
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
  verifyLogin: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    console.log("REQ.PAYLOAD----",req.payload)
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    try {
      let decode = jwt.verify(token, SECRETKEY);
      console.log("decode--",decode);
      if (decode) {
        if (decode.active === false) {
          console.log(decode);
          RESPONSE.msg = "Cuenta Suspendida";
          res.json(RESPONSE);
        } else {
          console.log(decode.userId);
          const user = await models.User.findOne({
            where: {
              id: decode.userId
            },
            include: [
              {
                model: models.NotificationRead,
                as: "notificationUsers",
                include: { model: models.Notification, as: "notification" }
              },
              {
                model: models.UserZone,
                as: "userZone",
                include: {
                  model: models.Zone,
                  as: "Zona",
                  include: { model: models.Destination, as: "Destinos" }
                }
              },
              {
                model: models.Employee,
                as: "Employee"
              },
              {
                model: models.UserCompany,
                as: "UserCompany",

                include: {
                  model: models.Company,
                  as: "Company"
                }
              }
            ]
          });
          console.log(user);
          RESPONSE.error = false;
          RESPONSE.data = user;
          RESPONSE.msg = "token activo";
          RESPONSE.token = token;
          res.status(200).json(RESPONSE);
        }
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      console.log(error.response);
      res.json(RESPONSE);
    }
  },
  findUser: async function(req, res) {
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
        },
        include: [
          {
            model: models.Employee,
            as: "Employee"
          },
          {
            model: models.UserCompany,
            as: "UserCompany"
          },
          {
            model: models.UserZone,
            as: "userZone",
            include: {
              model: models.Zone,
              as: "Zona"
            }
          }
        ]
      });
      RESPONSE.error = false;
      RESPONSE.msg = "Busqueda Exitosa";
      RESPONSE.data = user;
      res.json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error.message;
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

    const { companyId } = req.params;
    try {
      let user = await models.User.findAll({
        include: [
          {
            model: models.Employee,
            as: "Employee"
          },
          {
            model: models.UserCompany,
            as: "UserCompany",
            where: {
              [Op.and]: [{ companyId }, { privilege: { [Op.not]: "Admin" } }]
            }
          },
          {
            model: models.UserZone,
            as: "userZone",
            include: {
              model: models.Zone,
              as: "Zona"
            }
          }
        ]
      });
      (RESPONSE.error = false), (RESPONSE.msg = "Busqueda Exitosa");
      RESPONSE.data = user;
      res.status(200).json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findUsersByZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    console.log("FIND USERS ENDPOINT", req.params);
    const { zoneId } = req.params;
    try {
      let user = await models.User.findAll({
        include: [
          {
            model: models.Employee,
            as: "Employee"
          },
          {
            model: models.UserCompany,
            as: "UserCompany",
            where: {
              [Op.not]: [
                {
                  [Op.or]: [{ privilege: "Admin" }, { privilege: "Supervisor" }]
                }
              ]
            }
          },
          {
            model: models.UserZone,
            as: "userZone",
            where: { ZoneId: zoneId },
            include: {
              model: models.Zone,
              as: "Zona"
            }
          }
        ]
      });
      (RESPONSE.error = false), (RESPONSE.msg = "Busqueda Exitosa");
      RESPONSE.data = user;
      res.status(200).json(RESPONSE);
      console.log(user);
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findAvailableUsers: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { companyId } = req.params;
    console.log(req.params);
    try {
      let users = await models.User.findAll({
        where: {
          [Op.and]: [{ companyId }, { privilege: "Available" }]
        }
      });
      if (users) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa";
        RESPONSE.data = users;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
    console.log(req.params);
    const { id } = req.params;
    let array = [];
    if (id.length > 36) {
      array = id.split(",");
    }
    try {
      const userCompany = await models.UserCompany.findAll({
        where: {
          userId: array.length ? array : id
        }
      });
      //console.log(userCompany);
      if (userCompany) {
        userCompany.forEach(async element => {
            element.active = false;
            await element.save();  
            //await element.reload()
        });
        // userCompany.map(async elm => {
        //   elm.active = false;
        //   await elm.reload()
        //   await elm.save();
        // });
        //console.log(userCompany);
        // const userS = await models.User.findOne({
        //   include: [
        //     {
        //       model: models.Employee,
        //       as: "Employee"
        //     },
        //     {
        //       model: models.UserCompany,
        //       as: "UserCompany",  where: {
        //         active : 'false'
        //       },
              
        //     },
        //     {
        //       model: models.UserZone,
        //       as: "userZone",
        //       include: {
        //         model: models.Zone,
        //         as: "Zona"
        //       }
        //     }
        //   ]
        // })
        // console.log(userS.dataValues)
        RESPONSE.error = false;
        RESPONSE.msg = "Usuario(s) suspendido(s)!";
        RESPONSE.data = userCompany;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findCitizen: async function(req, res) {
    let RESPONSE = {
      error: true,
      data: null,
      msg: null,
      token: null
    };
    const { dni } = req.params;
    // try {
    //   const citizen = await models.Citizen.findOne({
    //     where: {
    //       dni
    //     }
    //   });
    //   if (citizen) {
    //     (RESPONSE.error = false),
    //       (RESPONSE.data = citizen),
    //       (RESPONSE.msg = "Busqueda exitosa!");
    //     res.json(RESPONSE);
    //   } else {
    //     RESPONSE.msg = "dni no registrado";
    //     res.json(RESPONSE);
    //   }
    // } catch (error) {
    //   RESPONSE.msg = error.message;
    //   res.json(RESPONSE);
    // }
  },
  //CREATE VISIT
  createVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    //console.log("headers---",req.headers)
    // console.log("BODY--", req.body);
    // console.log("fotos----", req.file);
    const {
      entryDate,
      descriptionEntry,
      departureDate,
      descriptionDeparture,
      userZoneId,
      destinyId,
      citizenId
    } = req.body;
    let visitInput = {
      entryDate,
      departureDate,
      UserZoneId: userZoneId,
      destinationId: destinyId,
      citizenId
    };
    if (descriptionEntry) visitInput.descriptionEntry = descriptionEntry;
    try {
      const visit = await models.Visits.create(
        {
          ...visitInput,
          Fotos: {
            picture: req.file.filename,
            entry: "algo"
          }
        },
        {
          include: {
            model: models.Picture,
            as: "Fotos"
          }
        }
      );
      if (visit) {
        //INCREMENT USERCOMPANY
        const user = await models.User.findOne({
          include: {
            model: models.UserZone,
            as: "userZone",
            where: {
              id: userZoneId
            }
          }
        });
        const userId = user.dataValues.id;
        const userCompany = await models.UserCompany.findOne({
          where: {
            userId
          }
        });
        console.log(userCompany.dataValues);
        await userCompany.increment("visits");
        await userCompany.reload();
        await userCompany.save();
        //console.log(userCompanyU)

        //INCREMENT ZONE
        const zone = await models.Zone.findOne({
          include: {
            model: models.UserZone,
            as: "encargado_zona",
            where: {
              id: userZoneId
            }
          }
        });
        //console.log("ZONE DATAVA---",zone.dataValues);

        await zone.increment("visits");
        await zone.reload();
        await zone.save();
        //INCREMENT DESTINY
        console.log("DESTINY ID---", destinyId);
        const destinyU = await models.Destination.findOne({
          where: { id: destinyId }
        });
        console.log("DESTINY FIND IT--", destinyU.dataValues);
        await destinyU.increment("visits");
        await destinyU.reload();
        await destinyU.save();

        RESPONSE.error = false;
        RESPONSE.data = visit;
        RESPONSE.msg = "Registro exitoso!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },

  //CREATE NEW CITIZEN AND VISIT
  createCitizen: async function(req, res) {
    let RESPONSE = {
      error: true,
      data: null,
      msg: null,
      token: null
    };
    const {
      name,
      lastName,
      dni,
      entryDate,
      descriptionEntry,
      departureDate,
      descriptionDeparture,
      userZoneId,
      destinyId
    } = req.body;
    console.log("req.body create citizen--", req.body);
    console.log(req.headers)
    try {
      let person = await models.Citizen.findOne({
        where: {
          dni
        }
      });
      if (person) {
        let visit = await models.Visits.create(
          {
            entryDate,
            descriptionEntry,
            departureDate,
            descriptionDeparture,
            destinationId: destinyId,
            UserZoneId: userZoneId,
            citizenId: person.id,
            Fotos: {
              picture: req.files[0].filename,
              entry: "algo"
            }
          },
          {
            include: {
              model: models.Picture,
              as: "Fotos"
            }
          }
        );
        //console.log("visita con dni ya registrado", visit)
        RESPONSE.msg = "Usuario ya registrado";
        RESPONSE.data = person;
        res.status(200).json(RESPONSE);
      } else {
        let visits = await models.Citizen.create(
          {
            dni,
            name,
            lastName,
            picture: req.files[0].filename,
            Visitas: {
              entryDate,
              descriptionEntry,
              departureDate,
              destinationId: destinyId,
              UserZoneId: userZoneId,
              Fotos: {
                picture: req.files[1].filename,
                entry: "algo"
              }
            }
          },
          {
            include: [
              {
                model: models.Visits,
                as: "Visitas",
                include: { model: models.Picture, as: "Fotos" }
              }
            ]
          }
        );
        //INCREMENT USERCOMPANY
        const user = await models.User.findOne({
          include: {
            model: models.UserZone,
            as: "userZone",
            where: {
              id: userZoneId
            }
          }
        });
        const userId = user.dataValues.id;
        const userCompany = await models.UserCompany.findOne({
          where: {
            userId
          }
        });
        console.log(userCompany.dataValues);
        await userCompany.increment("visits");
        await userCompany.reload();
        await userCompany.save();
        //console.log(userCompanyU)

        //INCREMENT ZONE
        const zone = await models.Zone.findOne({
          include: {
            model: models.UserZone,
            as: "encargado_zona",
            where: {
              id: userZoneId
            }
          }
        });
        //console.log("ZONE DATAVA---",zone.dataValues);

        await zone.increment("visits");
        await zone.reload();
        await zone.save();
        //INCREMENT DESTINY
        console.log("DESTINY ID---", destinyId);
        const destinyU = await models.Destination.findOne({
          where: { id: destinyId }
        });
        console.log("DESTINY FIND IT--", destinyU.dataValues);
        await destinyU.increment("visits");
        await destinyU.reload();
        await destinyU.save();

        RESPONSE.error = false;
        RESPONSE.msg = "Registro Exitoso";
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      console.log(error.message);
      res.json(RESPONSE);
    }
  },
  //FIND MAX VISITS REGISTER USER
  findMaxVisitUser: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { companyId } = req.params;
    try {
      const maxVisits = await models.UserCompany.findOne({
        where: {
          companyId,
          privilege: "Watchman"
        },
        attributes: [[fn("max", col("visits")), "visits"]],
        //group: ['id'],
        raw: true
      });
      const userCompany = await models.UserCompany.findAll({
        where: {
          companyId
        },
        raw: true
      });
      //ENCONTRAR EL VALOR MAS ALTO EN UN ARRAY DE OBJETOS
      // const prueba = Math.max.apply(Math, userCompany.map(function(o) { return o.visits; }))
      //DEVUELVE EL OBJETO CON LA PROPIEDAD MAS ALTA
      // const prueba = userCompany.reduce((prev, current) => (prev.visits > current.visits) ? prev : current)
      // console.log(prueba)

      const max = userCompany.filter(
        ({ visits }) => visits === maxVisits.visits
      );
      console.log(max);
      const userWithMax = await models.User.findOne({
        where: {
          id: max[0].userId
        },
        include: [
          { model: models.Employee, as: "Employee" },
          { model: models.UserCompany, as: "UserCompany" },
          { model: models.UserZone, as: "userZone" }
        ]
      });
      if (userCompany) {
        RESPONSE.error = false;
        (RESPONSE.data = userWithMax), (RESPONSE.msg = "Busqueda exitosa!");
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //DELETE Visits
  deleteVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.body;
    console.log("DELETE VISIT----", id);
    try {
      let visit = await models.Visits.destroy({
        where: {
          id
        }
      });
      if (visit) {
        RESPONSE.error = false;
        RESPONSE.data = visit;
        RESPONSE.msg = "Registro borrado con exito!";
        res.status(200).json(RESPONSE);
        console.log(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //CREATE DEPARTURE
  createDeparture: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const {
      departureDate,
      descriptionDeparture,
      userZoneId,
      destinationId
    } = req.body;
    const { id } = req.params;

    let inputs = {};
    inputs.visitId = id;
    inputs.departureDate = departureDate;
    inputs.UserZoneId = userZoneId;
    inputs.destinationId = destinationId;
    if (descriptionDeparture) {
      inputs.descriptionDeparture = descriptionDeparture;
    }

    let increment = false;
    try {
      let visit = await models.Visits.findOne({
        where: {
          id
        },
        include: {
          model: models.UserZone
        },
        raw: true
      });
      console.log(visit.UserZoneId, userZoneId);
      if (visit.UserZoneId !== userZoneId) {
        increment = true;
      }
      let departure = await models.Departure.create({ ...inputs });

      if (increment) {
        console.log("hay que incrementar");
        const user = await models.User.findOne({
          include: {
            model: models.UserZone,
            as: "userZone",
            where: {
              id: userZoneId
            }
          }
        });
        const userId = user.dataValues.id;
        console.log("userId----", userId);
        const userCompany = await models.UserCompany.findOne({
          where: {
            userId
          }
        });
        console.log(userCompany.dataValues);
        await userCompany.increment("visits");
        await userCompany.reload();
        await userCompany.save();
        console.log(userCompany.dataValues);
      }
      if (departure) {
        const visitU = await models.Visits.findOne({
          where: {
            id
          },

          include: [
            {
              model: models.Departure,
              as: "Salida",
              include: {
                model: models.UserZone,
                include: {
                  model: models.User,
                  as: "User",
                  include: {
                    model: models.Employee,
                    as: "Employee"
                  }
                }
              }
            },
            { model: models.Citizen, as: "Visitante" },
            { model: models.Destination, as: "Destino" },
            { model: models.Picture, as: "Fotos" },
            {
              model: models.UserZone,
              as: "UserZone",
              include: [
                { model: models.Zone, as: "Zona" },
                {
                  model: models.User,
                  as: "User",
                  include: {
                    model: models.Employee,
                    as: "Employee"
                  }
                }
              ]
            }
          ]
        });
        RESPONSE.error = false;
        RESPONSE.msg = "Actualizacion Existosa";
        RESPONSE.data = visitU;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //FIND VISIT BY ID
  findVisitId: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { id } = req.params;
    try {
      let visit = await models.Visits.findOne({
        where: {
          id
        },
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            as: "UserZone",
            include: [
              { model: models.Zone, as: "Zona" },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      if (visit) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa!";
        RESPONSE.data = visit;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //FIND BY DNI
  findVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };

    const { dni } = req.params;
    console.log(dni);

    try {
      let visit = await models.Visits.findAll({
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante", where: { dni } },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            as: "UserZone",
            include: [
              { model: models.Zone, as: "Zona" },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      console.log(visit);
      if (visit.length > 0) {
        RESPONSE.error = false;
        RESPONSE.msg = "Consulta Exitosa";
        RESPONSE.data = visit;

        res.json(RESPONSE);
      } else {
        RESPONSE.msg = "Dni no registrado";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //FIND TODAY VISITS FROM ALL EMPLOYEE
  findTodayVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };

    const { id } = req.body;
    try {
      let visits = await models.Visits.findAll({
        //where: {
        //   entryDate: {
        //     [Op.between]: [
        //       `${moment().format("YYYY-MM-DD")} 00:00:00`,
        //       `${moment().format("YYYY-MM-DD")} 23:59:00`
        //     ]
        // }
        //},
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.Destination,
            as: "Destino",
            attributes: ["id", "name"]
          },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              },
              {
                model: models.Zone,
                as: "Zona",
                where: {
                  id
                }
                // include: {
                //   model: models.Company,
                //   as: "companyZone",
                //   where: {
                //     id: companyId
                //   }
                // }
              }
            ]
          }
        ]
      });

      if (visits) {
        (RESPONSE.error = false), (RESPONSE.msg = "Busqueda exitosa!");
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
    const { userzoneId } = req.params;
    try {
      let visits = await models.Visits.findAll({
        where: {
          UserZoneId: userzoneId
          // entryDate: {
          //   [Op.between]: [
          //     `${moment().format("YYYY MM D, HH:mm:ss")} 00:00:00`,
          //     `${moment().format("YYYY MM D, HH:mm:ss")} 23:59:00`
          //   ]
          // }
        },
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            as: "UserZone",
            include: [
              { model: models.Zone, as: "Zona" },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      if (visits) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa!";
        RESPONSE.data = visits;
        res.json(RESPONSE);
      } else {
        RESPONSE.error = false;
        RESPONSE.msg = "No hay Resultados!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findTodayVisitsByDestiny: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    console.log("ENTRO--",req.params);
    const { destinyId, checked } = req.params;
    let array = [];
    if (destinyId.length) {
      array = destinyId.split(",");
    }

    try {
      let visits = await models.Visits.findAll({
        where: {
          destinationId: array.length ? array : destinyId
          // createdAt: {
          //   [Op.and]: {
          //     [Op.gt]: moment().format("YYYY-MM-DD 00:00"),
          //     [Op.lte]: moment().format("YYYY-MM-DD 23:59")
          //   }
          // }
          //createdAt : { [Op.gt] : moment().format('YYYY-MM-DD 00:00')},
          //createdAt : { [Op.lte] : moment().format('YYYY-MM-DD 23:59')}
        },
        //where: {

        //UserZoneId: id

        //},
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              {
                model: models.Zone,
                as: "Zona",
                attributes: ["id", "zone"]
              },
              {
                model: models.User,
                attributes: ["email"],
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      if (visits) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa!";
        RESPONSE.data = visits;
        res.json(RESPONSE);
      } else {
        RESPONSE.error = false;
        RESPONSE.msg = "No hay Resultados!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
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
      const visits = await models.Visits.findAll({
        // where: {
        //   entryDate: {
        //     [Op.between]: [
        //       moment()
        //         .subtract(7, "days")
        //         .calendar(),
        //       `${moment().format("YYYY-MM-DD")} 23:59:00`
        //     ]
        //   }
        // },
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.Destination,
            as: "Destino",
            attributes: ["id", "name"]
          },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              { model: models.Zone, as: "Zona", attributes: ["id", "zone"] },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee",
                  attributes: ["id", "name", "lastName", "dni", "picture"]
                }
              }
            ]
          }
        ]
      });

      if (visits) {
        (RESPONSE.error = false), (RESPONSE.msg = "Busqueda exitosa!");
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
  }
};

export default Controllers;
