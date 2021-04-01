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
import login from './login'
import employee from './employee'
import zone from './zone'
import destiny from './destiny'
import visits from './visits'

const SECRETKEY = process.env.SECRETKEY || $security().secretKey;


const Controllers = {
  login,
  employee,
  zone,
  destiny,
  visits,
  
  
  createCompany: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
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
