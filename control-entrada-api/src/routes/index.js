import { Router } from "express";
import Controllers from "@controllers";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { Unauthorized } from "http-errors";
import { $security, $serverPort } from "@config";
import models from "@models";
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;
//Storage
const storage = multer.diskStorage({
  destination: function(req, file, next) {
    next(null, path.join(__dirname, "../../public/imgs"));
  },
  filename: function(req, file, next) {
    const fileName = uuidv4() + path.extname(file.originalname);
    next(null, fileName);
  }
});

const uploadImg = multer({
  storage: storage,
  fileFilter: function(req, file, next) {
    let ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return next(new Error("Solo imagenes son permitidas"));
    }
    next(null, true);
  }
});

//VERIFY TOKEN MIDDLEWARE
const middleware = {
  verifyToken: async function(req, res, next) {
    if (!req.headers["authorization"])
      res.json({
        msg: "token missing or invalid"
      });
    //return next(createError(401, "Usuario no Autorizado"));
    const headerToken = req.headers["authorization"];
    const token = headerToken.split(" ")[1];
    const decoded = jwt.verify(token, SECRETKEY, async (err, payload) => {
      //console.log("ERR---",err)
      if(err){
        res.json({
          msg: err.message
        })
      }else{
        try {
          const user = await models.User.findOne({
            where: {
              id: payload.userId
            },
            include: {
              model: models.UserCompany,
              as: "UserCompany"
            }
          });
          if (user.dataValues.UserCompany[0].active === false) {
            return res.json({
              msg: "Cuenta suspendida"
            });
          } else {
            req.payload = payload;
            next();
          }
        } catch (error) {
          return res.json({
            msg: error.message
          });
        }
      }
      
    })
      //console.log("DECODE--",decoded)
      //console.log("PAYLOAD DE TOKEN---", payload);
      
  }
};

const router = Router();


router.put("/profile/:id", uploadImg.array("file"), Controllers.login.updateProfile);
router.post("/password/:email", Controllers.login.recoverPassword);
router.get("/verifyLogin", middleware.verifyToken, Controllers.login.verifyLogin);
router.post("/login", Controllers.login.login);
router.get("/findUser/:id", Controllers.employee.findUser);
router.get("/user/:companyId", Controllers.employee.findUsers);
router.get("/user/zone/:zoneId", Controllers.employee.findUsersByZone);
router.put("/user/:id", Controllers.employee.deleteUser);
//NOTIFICATION
router.get("/notification/:userId/:unread?", Controllers.notification.fetchAllNotification)
router.put("/notification/:id?", Controllers.notification.changeToRead)
//ZONES
router.post("/zone", middleware.verifyToken, Controllers.zone.createZone);
router.get("/findZones/:companyId", Controllers.zone.findZones);
router.get("/zone/:zoneId", Controllers.zone.findZone);
router.get("/zoneMaxVisit/:companyId", Controllers.zone.findZoneMaxVisit);
router.delete("/zone/:id", Controllers.zone.deleteZone);
//DESTINY
router.post("/destiny/:id", middleware.verifyToken, Controllers.destiny.createDestiny);
router.get("/findDestiny/:id", Controllers.destiny.findDestinyByZone);
router.get("/findAllDestiny/:id", Controllers.destiny.findAllDestiny);
router.post("/destinyMaxVisit", Controllers.destiny.findDestinyMaxVisit);
router.delete("/destiny/:id", middleware.verifyToken, Controllers.destiny.deleteDestiny);
//ROUTAS PARA BORRAR
// router.post("/createEmployee", Controllers.createEmployee);
// router.get("/findEmployees", Controllers.findEmployees);
// router.post("/createUserZone", Controllers.createUserZone);
//router.post("/uploadImage", uploadImg.single('file'), Controllers.uploadImage)
// router.get("/displayPicture", Controllers.displayPicture);
// router.put("/updateAdmin/:companyId", Controllers.updateAdminId);
// router.get("/findAvailableUsers/:companyId", Controllers.findAvailableUsers);
// router.get("/findCompany/:id", Controllers.findCompany);
// router.get("/findUserZone/:id", Controllers.findUserZone);
router.get("/profile", Controllers.getProfile);

//VISIT ROUTES
router.post(
  "/visit",
  middleware.verifyToken,
  uploadImg.single("file"),
  Controllers.visits.createVisits
);
router.get("/visitId/:id", Controllers.visits.findVisitId);
router.get("/visit/:dni", Controllers.visits.findVisit);
//todas las visitas de hoy por empleados
router.post("/visits", Controllers.visits.findTodayVisits);
router.get("/findWeekVisits/", Controllers.visits.findWeekVisits);
router.get("/visits/:userzoneId", Controllers.visits.findTodayVisitsByUser);
//todas las visitas de hoy por destino
router.get(
  "/visitsdestiny/:destinyId/:checked?",
  middleware.verifyToken,
  Controllers.visits.findTodayVisitsByDestiny
);
router.delete("/visit/", Controllers.visits.deleteVisit);
//DEPARTURE ROUTES
router.post(
  "/departure/:id",
  middleware.verifyToken,
  Controllers.visits.createDeparture
);

//CITIZEN
router.get("/citizen/:dni", middleware.verifyToken, Controllers.visits.findCitizen);
router.post(
  "/citizen",
  middleware.verifyToken,
  uploadImg.array("file"),
  Controllers.visits.createCitizen
);
//FIND MAX VALUE ROUTES
router.get("/userCompany/:companyId", Controllers.visits.findMaxVisitUser);
// NUEVAS RUTA AJUSTE SISTEMA
router.post("/company", uploadImg.array("file"), Controllers.createCompany);
router.post(
  "/supervisor",
  uploadImg.single("file"),
  Controllers.employee.createUserSupervisor
);
router.post(
  "/watchman",
  uploadImg.single("file"),
  Controllers.employee.createUserWatchman
);
//SAVE DEVICETOKEN
router.post("/token/:id", Controllers.login.saveDeviceToken)

module.exports = router;
