import { Router } from "express"
import Methods from "@methods"
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

const router = Router()

    
    router.post("/createUser", Methods.createUser)
    router.post("/login", Methods.login)
    router.get("/findUsers", Methods.findUsers)
    router.post("/createCompany", Methods.createCompany)
    router.get("/findCompany", Methods.findCompany)
    router.post("/createZone/:id", Methods.createZone)
    router.get("/findZones", Methods.findZones)
    router.post("/createDestiny/:id", Methods.createDestiny)
    router.get("/findDestiny/:id", Methods.findDestinyByZone)
    router.post("/createEmployee", Methods.createEmployee)
    router.get("/findEmployees", Methods.findEmployees)
    router.post("/createUserZone/:id", Methods.createUserZone)
    router.post("/uploadImage", uploadImg.single('file'), Methods.uploadImage)
    router.get("/displayPicture", Methods.displayPicture)
    router.get("/profile", Methods.getProfile)
    router.post("/createVisit", uploadImg.single('file'), Methods.createVisits)
    router.get("/findVisit/:id", Methods.findVisit)
module.exports = router