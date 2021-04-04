import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
import { Expo } from "expo-server-sdk";
import fetch from "node-fetch";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

//PRUEBA DE PUSH N
const expo = new Expo();

async function sendPushNotification(message) {
  // const message = {
  //   to: expoPushToken,
  //   sound: 'default',
  //   title: 'HOLA OMAIRA',
  //   body: 'And here is the body!',
  //   data: { someData: 'goes here' },
  // };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });
}
//---------->
const sendPush = async messages => {
  // let messages = [];
  // messages.push({
  //   to: pushToken,
  //   sound: "default",
  //   body: "This is a test notification",
  //   data: { withSome: "data" }
  // });
  try {
    let resPush = await expo.sendPushNotificationsAsync(messages);
    return console.log("RES DE SENDP--", resPush);
    // NOTE: If a ticket contains an error code in ticket.details.error, you
    // must handle it appropriately. The error codes are listed in the Expo
    // documentation:
    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
  } catch (error) {
    console.error(error);
  }
};

//FIN PRUEBA DE PUSH N

const notification = {
  //HELPER FOR CREATE NOTI
  createNotification: async function(
    userId,
    notification,
    notificationType,
    triggerId,
    targetId = null
  ) {
    // let message = {
    //   to: '',
    //   sound: 'default',
    //   title: 'HOLA OMAIRA',
    //   body: notification,
    //   data: { someData: 'goes here' },
    // };
    try {
      const deviceToken = await models.Token.findAll({
        where: {
          userId
        }
      });
      if (deviceToken) {
        let messages = [];
        deviceToken.map(token => {
          let message = {};
          message.to = token.dataValues.token;
          message.sound = "default";
          message.title = "Titulo";
          message.subtitle = 'sub titulo'
          message.body = notification;
          message.data = { someData: 'goes here' }
          message.vibrate = [200, 200, 200],
          message.launchImageName = 'https://i0.wp.com/paginadelespanol.com/wp-content/uploads/2019/06/Alguien-nadie-algo-nada-todo.png?fit=1080%2C1080&ssl=1'
          messages.push(message);
        });
        console.log("messages Array--", messages);
        
        const newNoti = await models.Notification.create({
          notification,
          notificationType,
          triggerId,
          targetId,
          userId,
          read: false
        });
        if (newNoti) {
          await sendPush(messages);
          return newNoti
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  //FETCH ALL NOTIFICATION FROM ONE USER
  fetchAllNotification: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    console.log("all noti--", req.params);
    const { userId, unread } = req.params;
    try {
      const noti = await models.Notification.findAll({
        where: {
          userId
        },
        include: {
          model: models.User,
          as: "User",
          include: {
            model: models.Employee,
            as: "Employee"
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
          console.log(RESPONSE)
        }
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //CHANGE READ STATUS
  changeToRead: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { id } = req.params;
    let arrayIds = [];
    if (id.length > 36) {
      arrayIds = id.split(",");
    }
    try {
      const noti = await models.Notification.findAll({
        where: {
          id: arrayIds.length ? arrayIds.length : id
        },
        include: {
          model: models.User,
          as: "User",
          include: {
            model: models.Employee,
            as: "Employee"
          }
        }
      });
      noti.map(elem => {
        elem.read = true;
        elem.save();
      });
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
