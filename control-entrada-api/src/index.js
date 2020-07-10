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

//Configurtion
import { $security, $serverPort } from "@config";
import { sendMail } from "@utils/sendMail";
import { encrypt } from "@utils/security";

//CONST CONFIG
const DEV = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || $serverPort();
const SECRETKEY = process.env.SECURITY_SECRETKEY || $security.secretKey;

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

app.get("/api/ping", (req, res) => {
  // random endpoint so that the client can call something
  res.json({ msg: "pong..." });
});

app.get("/api/allUser", async (req, res) => {
  // random endpoint so that the client can call something
  let user = await models.User.findAll({
    include: [
      {
        model: models.NotificationRead,
        as: "notificationUsers",
        include: { model: models.Notification, as: "notification" }
      }
    ]
  });
  res.json({ msg: user });
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

app.post("/api/createUser", async (req, res) => {
  let user = await models.User.create({
    email: req.body.email,
    password: req.body.password
  });
  if (user) {
    let mailOptions = {
      from: 'Segovia Develop 👻" <segoviadevelop@gmail.com>',
      to: req.body.email,
      subject: "Sending Email using Node.js - Control Entrada",
      text: "That was easy!",
      html:
        "<h1>Hello " +
        user.email +
        "</h1><br />Your Pin: " +
        user.pin +
        " and token validate " +
        user.tokenActivation
    };
    sendMail(mailOptions);
  }
  res.json({ msg: user });
});

app.post("/api/createNotification", async (req, res) => {
  //CREATE NOTIFICATION
  let user = await models.User.findByPk(req.body.id);

  let notificationInput = {
    notificationType: "Give",
    notification:
      "#title: Oh! parece que alguien te hizo un obsequio. #body: Que afortunado eres " +
      user.email +
      ", te acaba de obsequiar una oferta. Podrás acceder a tu regalo luego de haber aceptado. #action: ",
    notificationRead: [
      {
        userId: user.id
      }
    ]
  };

  let notification = await models.Notification.create(
    {
      ...notificationInput
    },
    {
      include: [
        {
          model: models.NotificationRead,
          as: "notificationRead"
        }
      ]
    }
  );

  res.json({
    msg: notification
  });
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
