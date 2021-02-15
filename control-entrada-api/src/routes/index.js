import { Router } from "express";
import Controllers from "@controllers";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { Unauthorized } from "http-errors";
import { $security, $serverPort } from "@config";
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
  verifyToken: function(req, res, next) {
    if (!req.headers["authorization"])
      return next(createError(401, "Usuario no Autorizado"));
    const headerToken = req.headers["authorization"];
    console.log("CABECERA-----",headerToken)
    const token = headerToken.split(" ")[1];
    jwt.verify(token, SECRETKEY, (err, payload) => {
      console.log(payload);
      if (err) return next(createError(401, err.message));
      res.payload = payload;
      next();
    });
  }
};

const router = Router();

//router.post("/createAdmin", uploadImg.single("file"), Methods.createAdmin);
router.post(
  "/createUser/:privilege",
  uploadImg.single("file"),
  Controllers.createUser
);
router.put("/updatePass/:id", Controllers.updatePass);
router.put("/updateAdmin/:companyId", Controllers.updateAdminId);
router.post("/login", Controllers.login);
router.get("/findUser/:id", Controllers.findUser)
router.get("/findUsers/:companyId", Controllers.findUsers);
router.get("/findAvailableUsers/:companyId", Controllers.findAvailableUsers);
router.delete("/deleteUser/:id", Controllers.deleteUser);
router.get("/findCompany/:id", Controllers.findCompany);
router.post("/createZone/:id", Controllers.createZone);
router.get("/findZones/:companyId", Controllers.findZones);
router.get("/findZone/:zoneId", Controllers.findZone);
router.delete("/deleteZone", Controllers.deleteZone);
router.post("/createDestiny/:id", Controllers.createDestiny);
router.get("/findDestiny/:id", Controllers.findDestinyByZone);
router.delete("/deleteDestiny/:id", Controllers.deleteDestiny);
router.post("/createEmployee", Controllers.createEmployee);
router.get("/findEmployees", Controllers.findEmployees);
router.post("/createUserZone", Controllers.createUserZone);
//router.post("/uploadImage", uploadImg.single('file'), Controllers.uploadImage)
router.get("/displayPicture", Controllers.displayPicture);
router.get("/profile", Controllers.getProfile);
router.get("/findUserZone/:id", Controllers.findUserZone);
router.get("/verifyToken", Controllers.verifyExpToken);
router.post(
  "/createVisit/:id",
  middleware.verifyToken,
  uploadImg.array("file"),
  Controllers.createVisits
);
router.delete("/deleteVisit/:id", Controllers.deleteVisit);
router.get("/findVisit/:id", Controllers.findVisit);
router.get("/findVisitId/:id", Controllers.findVisitId);
router.put("/updateVisit/:id", middleware.verifyToken, Controllers.updateVisit);
router.get("/findTodayVisits/:companyId", Controllers.findTodayVisits);
router.get("/findTodayVisitsByUser/:id", Controllers.findTodayVisitsByUser);
router.get("/findWeekVisits/", Controllers.findWeekVisits);
// NUEVAS RUTA AJUSTE SISTEMA
router.post("/createCompany", Controllers.createCompany);
router.post(
  "/createUserSupervisor",
  uploadImg.single("file"),
  Controllers.createUserSupervisor
);
router.post(
  "/createUserWatchman",
  uploadImg.single("file"),
  Controllers.createUserWatchman
);
//PRUEBAS
router.get("/test", (req, res) => {
  res.send("hello world");
});
module.exports = router;
