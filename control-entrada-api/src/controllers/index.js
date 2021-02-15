import models from "@models";
import { encrypt } from "@utils/security";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { $security, $serverPort } from "@config";
import options from "dotenv/lib/env-options";
import moment from "moment";
import { Op } from "sequelize";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

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
      dni,
      name,
      lastName,
      email,
      password,
      logo,
      picture
    } = req.body;

    console.log("algo", req.body);
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
          dni: dni,
          name: name,
          lastName: lastName,
          //picture: picture, ajustar a la carga de archivo
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
        //logo, ajustar al subir archivo
      };

      if (phoneNumberOther) {
        inputCompany.phoneNumberOther = phoneNumberOther;
      }

      let newCompany = await models.Company.create({ ...inputCompany });

      let inputUserCompany = {
        companyId: newCompany.id,
        userId: NewUser.id,
        privilege: "Admin"
      };

      if (NewUser && newCompany) {
        let userCompany = await models.UserCompany.create({
          ...inputUserCompany
        });

        if (userCompany) {
          RESPONSE.error = false;
          RESPONSE.msg = "Registro Exitoso!";
          RESPONSE.data = NewUser;
          res.status(200).json(RESPONSE);
        }
      }

      RESPONSE.msg = "error al registrar empresa";
      res.json(RESPONSE);
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
      SecondDepartureTime
    } = req.body;
    const { id } = req.params;
    console.log(req.body);
    console.log(req.params);
    try {
      let inputZone = {
        zone,
        companyId: id
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

      RESPONSE.error = false;
      RESPONSE.msg = "Creacion de Zona Exitasa!";
      RESPONSE.data = zoneC;
      res.json(RESPONSE);
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
  deleteZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { zonesId } = req.body;
    console.log("body de delete--", req.body);
    console.log(zonesId);
    try {
      let userZones = await models.UserZone.findAll({
        where: {
          ZoneId: zonesId
        },
        include: [
          {
            model: models.User
          }
        ]
      });
      let zones = await models.Zone.findAll({
        where: {
          id: zonesId
        }
      });
      let trabajadores = [];
      let trabajadoresId = [];
      console.log("userZone*-------", userZones);
      //console.log("zone*-------", zones);
      if (userZones.length > 0) {
        trabajadores = userZones.map(uz => uz.User);
        console.log("trabajadores---", trabajadores);

        trabajadores.map(async trabajador => {
          (trabajador.privilege = "Available"), await u.save();
        });
        userZones.map(async uz => await uz.destroy());
        zones.map(async zone => await zone.destroy());
        RESPONSE.error = false;
        RESPONSE.msg = "Registro borrado!";
        RESPONSE.data = usersToUpdate;
        res.json(RESPONSE);
      } else {
        console.log("zona sin encargados!!!!");
        zones.map(async zone => await zone.destroy());
        RESPONSE.error = false;
        RESPONSE.msg = "Registro borrado!";
        RESPONSE.data = zones;
        res.json(RESPONSE);
      }
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
  deleteDestiny: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      let destiny = await models.Destination.findOne({
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
            privilege
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
          RESPONSE.error = false;
          RESPONSE.msg = "Registro Exitoso!";
          RESPONSE.data = employee;
          res.status(200).json(RESPONSE);
          console.log(RESPONSE.data);
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
            privilege
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
          RESPONSE.error = false;
          RESPONSE.msg = "Registro Exitoso!";
          RESPONSE.data = employee;
          res.status(200).json(RESPONSE);
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
    try {
      let user = await models.User.findOne({
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
            where: {
              active: true
            },
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
      console.log("USER LOGIN----", user);
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          let token = jwt.sign(user.dataValues, SECRETKEY, { expiresIn: "1d" });
          RESPONSE.error = false;
          RESPONSE.msg = "Inicio Exitoso";
          RESPONSE.data = user;
          RESPONSE.token = token;
          res.json(RESPONSE);
        } else {
          RESPONSE.msg = "Clave Invalida";
          res.json(RESPONSE);
        }
      } else {
        RESPONSE.msg = "Usuario no registrado";
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
    console.log(req.headers);
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
  updatePass: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    const { password } = req.body;
    console.log(req.params);
    console.log(req.body);
    try {
      let user = await models.User.findOne({
        where: {
          id
        }
      });
      let hash = await bcrypt.hash(password, 10);
      user.password = hash;
      await user.save();
      RESPONSE.error = false;
      RESPONSE.msg = "Cambio de contraseña exitoso!";
      RESPONSE.data = user;
      res.status(200).json(RESPONSE);
    } catch (error) {
      RESPONSE.msg = error;
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
  verifyExpToken: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    console.log("token---", token);
    try {
      let decode = jwt.verify(token, SECRETKEY);
      console.log("decode------", decode);
      if (decode) {
        RESPONSE.error = false;
        RESPONSE.data = decode;
        RESPONSE.msg = "token activo";
        RESPONSE.token = token;
        res.status(200).json(RESPONSE);
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
    console.log("FIND USER ENDPOINT", req.params);
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
      console.log(user);
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
    console.log("FIND USERS ENDPOINT", req.params);
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
      console.log(user);
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
              [Op.not]: [{[Op.or]: [{privilege: 'Admin'},{privilege:'Supervisor'}]}]
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
    console.log("BODY--", req.body);
    console.log("PARAMS---", req.params);
    console.log("1 foto:---", req.file);
    console.log("varias fotos----", req.files);
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
            destinationId: id,
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
        RESPONSE.msg = "Registro Exitoso!";
        RESPONSE.data = visit;
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
              descriptionDeparture,
              destinationId: id,
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
  //DELETE Visits
  deleteVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params;
    try {
      let visit = await models.Visits.findOne({
        where: {
          id
        }
      });
      if (visit) {
        visit.destroy();
        RESPONSE.error = false;
        RESPONSE.data = visit;
        RESPONSE.msg = "Registro borrado con exito!";
        res.status(200).json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
    console.log(req.body, req.params);
    try {
      let visit = await models.Visits.findOne({
        where: {
          id
        }
      });
      if (visit) {
        //console.log(visit);
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
          { model: models.Citizen, as: "Visitante" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.Destination,
            as: "Destino",
            attributes: ["id", "name"]
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

    const { id } = req.params;
    console.log("VISIT BY DNI----", req.params);

    try {
      let visit = await models.Citizen.findOne({
        where: { dni: id },
        include: [
          {
            model: models.Visits,
            as: "Visitas",
            include: [
              { model: models.Destination, as: "Destino" },
              { model: models.Picture, as: "Fotos" },
              {
                model: models.UserZone,
                include: [
                  { model: models.Zone, as: "Zona" },
                  { model: models.User, as: "User" }
                ]
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
      } else {
        RESPONSE.msg = "Dni no registrado";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
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
    const { companyId } = req.params;

    console.log(req.params);
    try {
      let visits = await models.Visits.findAll({
        where: {
          entryDate: {
            [Op.between]: [
              `${moment().format("YYYY-MM-DD")} 00:00:00`,
              `${moment().format("YYYY-MM-DD")} 23:59:00`
            ]
          }
        },
        include: [
          { model: models.Citizen, as: "Visitante" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.Destination,
            as: "Destino",
            attributes: ["id", "name"],
            include: {
              model: models.Zone,
              as: "Zona",
              where: { companyId },
              attributes: ["id", "zone"]
            }
          },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: {
              model: models.User,
              as: "User",
              include: {
                model: models.Employee,
                as: "Employee"
              }
            }
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
    const { id } = req.params;
    console.log(req.params);
    try {
      let visits = await models.Visits.findAll({
        where: {
          UserZoneId: id
          // entryDate: {
          //   [Op.between]: [
          //     `${moment().format("YYYY MM D, HH:mm:ss")} 00:00:00`,
          //     `${moment().format("YYYY MM D, HH:mm:ss")} 23:59:00`
          //   ]
          // }
        },
        include: [
          { model: models.Citizen, as: "Visitante" },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              { model: models.Zone, as: "Zona", attributes: ["id", "zone"] },
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
        console.log("visits", visits);
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
  findTodayVisitsByZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { zoneId } = req.params;
    console.log("zoneId-----", req.params);
    try {
      let visits = await models.Visits.findAll({
        //where: {

        //UserZoneId: id
        // entryDate: {
        //   [Op.between]: [
        //     `${moment().format("YYYY MM D, HH:mm:ss")} 00:00:00`,
        //     `${moment().format("YYYY MM D, HH:mm:ss")} 23:59:00`
        //   ]
        // }
        //},
        include: [
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
                attributes: ["id", "zone"],
                where: { id: zoneId }
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
        console.log("visits", visits);
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
      let visits = await models.Visits.findAll({
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
          { model: models.Citizen, as: "Visitante" },
          { model: models.Picture, as: "Fotos" },
          { model: models.Destination, attributes: ["id", "name"] },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              { model: models.Zone, as: "Zona", attributes: ["id", "zone"] },
              {
                model: models.User,
                as: "User",
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
  }
};

export default Controllers;
