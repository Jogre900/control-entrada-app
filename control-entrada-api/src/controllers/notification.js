import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

const notification = {
  //FETCH ALL NOTIFICATION FROM ONE USER
  fetchAllNotification: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    console.log("all noti--",req.params)
    const { userId, unread } = req.params;
    try {
      const noti = await models.Notification.findAll({
        where: {
          userId
        },
        include: {
            model: models.User, as: 'User', include: {
                model: models.Employee, as: 'Employee'
            }
        }
      });
      if (noti) {
        if (unread) {
          let unreadArray = [];
          unreadArray = noti.filter(({ read }) => read === false);
          RESPONSE.error = false;
          RESPONSE.msg = "Busqueda exitosa!";
          RESPONSE.data = unreadArray;
          res.json(RESPONSE);
        } else {
          RESPONSE.error = false;
          RESPONSE.msg = "Busqueda exitosa!";
          RESPONSE.data = noti;
          res.json(RESPONSE);
        }
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //CHANGE READ STATUS
  changeToRead: async function(req, res){
    let RESPONSE = {
        error: true,
        msg: "",
        data: null,
        tokn: null
      };
      const { id } = req.params;
      let arrayIds = []
      if(id.length > 36){
          arrayIds = id.split(',')
      }
      try {
        const noti = await models.Notification.findAll({
            where: {
              id: arrayIds.length ? arrayIds.length : id 
            }
          });
          noti.map((elem) => {
            elem.read = true
            elem.save()
          })
          RESPONSE.error = false;
          RESPONSE.msg = "Actualizacion exitosa!";
          RESPONSE.data = noti;
          res.json(RESPONSE);
      } catch (error) {
        RESPONSE.msg = error.message;
        res.json(RESPONSE);
      } 
  }
};

export default notification;
