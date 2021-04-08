import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;


const employee = {
  //HELPERS
  //FIND ADMIN
  findAdmin: async function(userCompany){
     const admin = await models.UserCompany.findOne({
      where: {
        [Op.and]: [
          { privilege: "Admin" },
          { companyId: userCompany.dataValues.companyId }
        ]
      }
    });
    console.log("ADMIN-", admin.dataValues);
    const adminId = admin.dataValues.userId;
    return adminId
  },
  
  //FIND ALL SUPERVISOR FROM ONE ZONE
  findSuper: async function(zoneId){
        // const userZoneN = await models.UserZone.findOne({
        //   where: {
        //     id: userZoneId
        //   }
        // });

        const alluserZone = await models.UserZone.findAll({
          where: {
            ZoneId: zoneId
          }
        });

        let usersArrayId = [];
        alluserZone.map(elem => {
          usersArrayId.push(elem.dataValues.UserId);
        });

        const superUsers = await models.User.findAll({
          where: {
            id: usersArrayId
          },
          include: {
            model: models.UserCompany,
            as: "UserCompany",
            where: {
              privilege: "Supervisor"
            }
          }
        });

        let supersIdArray = [];
        superUsers.map(elem => {
          supersIdArray.push(elem.dataValues.id);
        });
        console.log("supers ID Array--", supersIdArray);
        return supersIdArray
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
}

export default employee