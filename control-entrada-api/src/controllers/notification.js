import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { $security, $serverPort } from "@config";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

const notification = {
    //FETCH NOTIFICATION NOT READ
    fetchNotificationNotRead: async function(req, res){
        let RESPONSE = {
            error: true,
            msg: "",
            data: null,
            tokn: null
          };
          const { userId} = req.params
        try {
            const noti = await models.Notification.findAll({
                where: {
                    [Op.and]: [{userId}, {read: false}]
                }
            })
            if(noti){
                RESPONSE.error = false
                RESPONSE.msg = 'Busqueda exitosa!'
                RESPONSE.data = noti
                res.json(RESPONSE)
            }
        } catch (error) {
            RESPONSE.msg = error.message
            res.json(RESPONSE)
        }
    }
}

export default notification