import { Router } from "express";
import Methods from "@methods";
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
  Methods.createUser
);
router.put("/updatePass/:id", Methods.updatePass);
router.put("/updateAdmin/:companyId", Methods.updateAdminId)
router.post("/login", Methods.login);
router.get("/findUsers/:companyId", Methods.findUsers);
router.delete("/deleteUser/:id", Methods.deleteUser);
router.post("/createCompany/", Methods.createCompany);
router.get("/findCompany/:id", Methods.findCompany);
router.post("/createZone/:id", Methods.createZone);
router.get("/findZones/:companyId", Methods.findZones);
router.delete("/deleteZone/:id", Methods.deleteZone);
router.post("/createDestiny/:id", Methods.createDestiny);
router.get("/findDestiny/:id", Methods.findDestinyByZone);
router.delete("/deleteDestiny/:id", Methods.deleteDestiny);
router.post("/createEmployee", Methods.createEmployee);
router.get("/findEmployees", Methods.findEmployees);
//router.post("/createUserZone/:id", Methods.createUserZone)
//router.post("/uploadImage", uploadImg.single('file'), Methods.uploadImage)
router.get("/displayPicture", Methods.displayPicture);
router.get("/profile", Methods.getProfile);
router.get("/findUserZone/:id", Methods.findUserZone);
router.get("/verifyToken", Methods.verifyExpToken);
router.post(
  "/createVisit/:id",
  middleware.verifyToken,
  uploadImg.array("file"),
  Methods.createVisits
);
router.delete("/deleteVisit/:id", Methods.deleteVisit);
router.get("/findVisit/:id", Methods.findVisit);
router.get("/findVisitId/:id", Methods.findVisitId);
router.put("/updateVisit/:id", middleware.verifyToken, Methods.updateVisit);
router.get("/findTodayVisits/:companyId", Methods.findTodayVisits);
router.get("/findTodayVisitsByUser/:id", Methods.findTodayVisitsByUser);
router.get("/findWeekVisits/", Methods.findWeekVisits);
//PRUEBAS
router.get("/test", (req, res) => {
  res.send("hello world");
});
module.exports = router;
