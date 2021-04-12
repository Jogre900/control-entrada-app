import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
import employee from "./employee";
import notification from "./notification";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;
const destiny = {
  createDestiny: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { name } = req.body;
    const { id } = req.params;
    console.log("CREATE DESTINY CONTROLLER--", req.params, req.body);
    try {
      const destiny = await models.Destination.create({
        name,
        zoneId: id,
        visits: 0
      });
      const user = await models.User.findOne({
        where: {
          id: req.payload.userId
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
            as: "userZone"
          }
        ]
      });

      if (req.payload.privilege === "Supervisor") {
        //findAdmin
        console.log(
          "USERCOMPNAY CREATE DESTINY--",
          user.dataValues.UserCompany
        );
        const adminIdArray = [];
        const adminId = await employee.findAdmin(
          user.dataValues.UserCompany[0]
        );
        adminIdArray.push(adminId);
        notification.createNotification(
          adminIdArray,
          `${user.dataValues.Employee.name} ${user.dataValues.Employee.lastName} ${notification.notificationMessage.CREATE_DESTINY}`,
          notification.notificationType.CREATE_DESTINY,
          user.dataValues.id,
          id
        );
      } else {
        //find all supervisor from the zone
        const supersId = await employee.findSuper(id);
        notification.createNotification(
          supersId,
          `${user.dataValues.Employee.name} ${user.dataValues.Employee.lastName} ${notification.notificationMessage.CREATE_DESTINY}`,
          notification.notificationType.CREATE_DESTINY,
          user.dataValues.id,
          id
        );
      }
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

    let array = [];
    if (id.length > 36) {
      array = id.split(",");
    }

    try {
      const destinys = await models.Destination.findAll({
        where: {
          id: array.length ? array : id
        },
        include: {
          model: models.Zone,
          as: "Zona"
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
            const user = await models.User.findOne({
              where: {
                id: req.payload.userId
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
                  as: "userZone"
                }
              ]
            });
            if (req.payload.privilege === "Supervisor") {
              //findAdmin
              const adminIdArray = [];
              const adminId = await employee.findAdmin(
                user.dataValues.UserCompany[0]
              );
              adminIdArray.push(adminId);
              notification.createNotification(
                adminId,
                `${user.dataValues.Employee.name} ${user.dataValues.Employee.lastName} ${notification.notificationMessage.DELETE_DESTINY}`,
                notification.notificationType.DELETE_DESTINY,
                user.dataValues.id
              );
            } else {
              //find all supervisor from the zone
              const supersId = await employee.findSuper(
                user.dataValues.userZone.ZoneId
              );
              notification.createNotification(
                supersId,
                `${user.dataValues.Employee.name} ${user.dataValues.Employee.lastName} ${notification.notificationMessage.DELETE_DESTINY}`,
                notification.notificationType.DELETE_DESTINY,
                user.dataValues.id
              );
            }

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
  }
};

export default destiny;
