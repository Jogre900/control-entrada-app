import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
import notification from "./notification";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;
const zone = {
  createZone: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const {
      companyId,
      zone,
      firsEntryTime,
      firsDepartureTime,
      SecondEntryTime,
      SecondDepartureTime,
      destiny
    } = req.body;
    console.log(req.body);
    console.log(req.params);
    try {
      let inputZone = {
        zone,
        companyId,
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
      // const push = await notification.createNotification(
      //   "91e9beaf-f8eb-40bf-8f9d-2486613b6dd3",
      //   "mensaje de prueba 3",
      //   "tipo prueba 3",
      //   "91e9beaf-f8eb-40bf-8f9d-2486613b6dd1"
      // );
      // console.log("push----", push);
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
  }
};

export default zone;
