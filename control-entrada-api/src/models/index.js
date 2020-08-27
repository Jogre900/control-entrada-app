// Dependencies
import Sequelize from "sequelize";

// Configuration
import { $db } from "@config";

// Db Connection
const { database, username, password, dialect, logging } = $db();

//ENV CONST
const DB = process.env.DB_DATABASE;
//console.log("ENV DATABASE: ", DB);

const sequelize = new Sequelize(database, username, password, {
  dialect,
  define: {
    underscored: true,
  },
  
});

// Models
const models = {
  User: sequelize.import("./User"),
  //SIN EDITAR O REVISAR
  Notification: sequelize.import("./Notification"),
  NotificationRead: sequelize.import("./NotificationRead"),
  company: sequelize.import("./company.js"),
  employee: sequelize.import("./employee.js"),
  zone: sequelize.import("./zone.js"),
  destination: sequelize.import("./destination.js"),
  userZone: sequelize.import("./userZone.js"),
  citizen: sequelize.import("./citizen.js"),
  visits: sequelize.import("./visits.js"),
  picture: sequelize.import("./picture.js"),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
