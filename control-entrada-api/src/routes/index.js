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
    const decoded = jwt.verify(token, SECRETKEY)
      console.log(decoded)
      //console.log("PAYLOAD DE TOKEN---", payload);
      try {
        const user = await models.User.findOne({
          where: {
            id: decoded.userId
          },
          include: {
            model: models.UserCompany,
            as: "UserCompany"
          }
        });
        if (user.dataValues.UserCompany[0].active === false) {
          //return next(createError(401, 'Cuenta suspendida'))
          return res.json({
            msg: "Cuenta suspendida"
          });
        } else {
          req.payload = decoded;
          next();
        }
      } catch (error) {
        //return next(createError(error, err.message));
        return res.json({
          msg: error.message
        });
      }
  }
};

const router = Router();

//router.post("/createAdmin", uploadImg.single("file"), Methods.createAdmin);
router.post(
  "/createUser/:privilege",
  uploadImg.single("file"),
  Controllers.createUser
);

router.put("/updateAdmin/:companyId", Controllers.updateAdminId);
router.post("/login", Controllers.login);
router.get("/findUser/:id", Controllers.findUser);
router.get("/user/:companyId", Controllers.findUsers);
router.get("/user/zone/:zoneId", Controllers.findUsersByZone);
router.get("/findAvailableUsers/:companyId", Controllers.findAvailableUsers);
router.put("/user/:id", Controllers.deleteUser);
router.get("/findCompany/:id", Controllers.findCompany);
//ZONES
router.post("/createZone/:id", Controllers.createZone);
router.get("/findZones/:companyId", Controllers.findZones);
router.get("/zone/:zoneId", Controllers.findZone);
router.get("/zoneMaxVisit/:companyId", Controllers.findZoneMaxVisit);
router.delete("/zone/:id", Controllers.deleteZone);
//DESTINY
router.post("/createDestiny/:id", Controllers.createDestiny);
router.get("/findDestiny/:id", Controllers.findDestinyByZone);
router.get("/findAllDestiny/:id", Controllers.findAllDestiny);
router.post("/destinyMaxVisit", Controllers.findDestinyMaxVisit);
router.delete("/destiny/:id", Controllers.deleteDestiny);
//ROUTAS PARA BORRAR
router.post("/createEmployee", Controllers.createEmployee);
router.get("/findEmployees", Controllers.findEmployees);
router.post("/createUserZone", Controllers.createUserZone);
//router.post("/uploadImage", uploadImg.single('file'), Controllers.uploadImage)
router.get("/displayPicture", Controllers.displayPicture);
router.get("/profile", Controllers.getProfile);
router.put("/profile/:id", uploadImg.array("file"), Controllers.updateProfile);
router.post("/password/:email", Controllers.recoverPassword);

router.get("/findUserZone/:id", Controllers.findUserZone);
router.get("/verifyLogin", middleware.verifyToken, Controllers.verifyLogin);
//VISIT ROUTES
router.post(
  "/visit",
  middleware.verifyToken,
  uploadImg.single("file"),
  Controllers.createVisits
);
router.get("/visitId/:id", Controllers.findVisitId);
router.get("/visit/:dni", Controllers.findVisit);
//todas las visitas de hoy por empleados
router.post("/visits", Controllers.findTodayVisits);
router.get("/findWeekVisits/", Controllers.findWeekVisits);
router.get("/visits/:userzoneId", Controllers.findTodayVisitsByUser);
//todas las visitas de hoy por destino
router.get(
  "/visitsdestiny/:destinyId/:checked?",
  middleware.verifyToken,
  Controllers.findTodayVisitsByDestiny
);
router.delete("/visit/", Controllers.deleteVisit);
//DEPARTURE ROUTES
router.post(
  "/departure/:id",
  middleware.verifyToken,
  Controllers.createDeparture
);

//CITIZEN
router.get("/citizen/:dni", middleware.verifyToken, Controllers.findCitizen);
router.post(
  "/citizen",
  middleware.verifyToken,
  uploadImg.array("file"),
  Controllers.createCitizen
);
//FIND MAX VALUE ROUTES
router.get("/userCompany/:companyId", Controllers.findMaxVisitUser);
// NUEVAS RUTA AJUSTE SISTEMA
router.post("/company", uploadImg.array("file"), Controllers.createCompany);
router.post(
  "/supervisor",
  uploadImg.single("file"),
  Controllers.createUserSupervisor
);
router.post(
  "/watchman",
  uploadImg.single("file"),
  Controllers.createUserWatchman
);
//SAVE DEVICETOKEN
router.post("/token/:id", Controllers.saveDeviceToken)

module.exports = router;
