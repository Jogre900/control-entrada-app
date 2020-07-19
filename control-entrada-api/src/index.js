//Dependencies
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

//routes
import router from "@routes";

//Configurtion
import { $security, $serverPort } from "@config";
import { sendMail } from "@utils/sendMail";
import { encrypt } from "@utils/security";

//CONST CONFIG
const routes = router;
const DEV = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || $serverPort();
const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

//Middlewares

//Storage
const storage = multer.diskStorage({
  destination: function(req, file, next) {
    next(null, path.join(__dirname, "../public/imgs/"));
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

//Init sequelize
import models from "@models";

//Running Express Server
const app = express();

//Public static
app.use(express.static(path.join(__dirname, "../public")));

//Middlewares
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SECRETKEY
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(SECRETKEY));
app.use(cors({ credentials: true, origin: true }));

// CORS middleware
/* app.use(function (req, res, next) {
    // Allow Origins
    res.header("Access-Control-Allow-Origin", "*");
    // Allow Methods
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    // Allow Headers
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Accept, Content-Type, Authorization"
    );
    // Handle preflight, it must return 200
    if (req.method === "OPTIONS") {
      // Stop the middleware chain
      return res.status(200).end();
    }
    // Next middleware
    next();
  });*/

//Routes
app.use("/api", routes);
app.post("/api/uploadImg", uploadImg.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  //retornar el nombre del archivo para guardar en la base de datos
  res.send(file);
});

app.post("/api/login", async (req, res) => {
  let response = { value: "", error: false, msg: "" };
  // random endpoint so that the client can call something
  let user = await models.User.findOne({
    where: {
      email: req.body.email,
      password: encrypt(req.body.password)
    }
  });

  if (user) {
    response.value = user;
  } else {
    response.error = true;
    response.msg = "Usuario Invalido!";
  }
  res.json(response);
});

app.get("/salir", (req, res) => {
  res.clearCookie("at");
  res.redirect("/login");
});

//TODO ruta creacion providers

console.log("port: ", PORT);

//Running Server sequelize config
const alter = false;
const force = false;

models.sequelize.sync({ alter, force }).then(() => {
  app.listen(PORT, function() {
    console.log("Running!!! Port: ", PORT);
  });
});
