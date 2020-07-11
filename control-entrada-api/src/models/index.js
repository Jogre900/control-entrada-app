// Dependencies
import Sequelize from "sequelize";

// Configuration
import { $db } from "@config";

// Db Connection
const { database, username, password, dialect } = $db();

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
  Company: sequelize.import("./company.js"),
  Employee: sequelize.import("./employee.js"),
  Zone: sequelize.import("./zone.js"),
  Destination: sequelize.import("./destination.js"),
  UserZone: sequelize.import("./userZone.js"),
  Citizen: sequelize.import("./citizen.js"),
  Visits: sequelize.import("./visits.js"),
  Picture: sequelize.import("./picture.js"),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
