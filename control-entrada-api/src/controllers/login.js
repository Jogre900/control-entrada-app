import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;
const login = {
  saveDeviceToken: async function(token, userId) {
    try {
      const newToken = await models.Token.create({
        token,
        userId
      });
      if (newToken) {
        return newToken
      }
    } catch (error) {
      return error.message;
    }
  },
  logIn: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { email, password, deviceToken } = req.body;
    
    console.log(req.body)
    try {
      const user = await models.User.findOne({
        where: {
          email: email.toLowerCase()
        },
        include: [
          {
            model: models.Notification,
            as: "notificationUsers"
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
            let token = jwt.sign(tokenInput, SECRETKEY, {
              expiresIn: "1d"
            });
            await login.saveDeviceToken(deviceToken, user.dataValues.id)
            RESPONSE.error = false;
            RESPONSE.msg = "Inicio Exitoso";
            RESPONSE.data = user;
            RESPONSE.token = token;
            //this.saveDeviceToken(user.dataValues.id, tokenBody)
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
  logOut: async function(req, res){
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.params
    try {
      const token = await models.Token.destroy({
        where: {
          userId: id
        }
      })
      if(token){
        RESPONSE.error = false
        RESPONSE.msg = 'Token del dispositivo Borrado!'
        RESPONSE.data = token
        res.json(RESPONSE)
      }
    } catch (error) {
      RESPONSE.msg = error.message
      res.json(RESPONSE)
    }
  },
  verifyLogin: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    try {
      let decode = jwt.verify(token, SECRETKEY);
      
      if (decode) {
        if (decode.active === false) {
          
          RESPONSE.msg = "Cuenta Suspendida";
          res.json(RESPONSE);
        } else {
          
          const user = await models.User.findOne({
            where: {
              id: decode.userId
            },
            include: [
              {
                model: models.Notification,
                as: "notificationUsers"
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
  updateProfile: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    console.log("UPDATE PROFILE----");
    const { id } = req.params;
    const {
      password,
      nic,
      address,
      city,
      number,
      numberTwo,
      profile,
      logo
    } = req.body;

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
      } else if (profile) {
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
        } else if (logo) {
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
  }
};

export default login;
