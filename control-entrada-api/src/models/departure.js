import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Departure extends Model {
    static associate = models => {
      this.belongsTo(models.Visits, {
        foreignKey: {
            name: "visitId",
            field: "visit_id"
          },
          as: "Entrada"
      });
      this.belongsTo(models.UserZone, {
        foreigKey: {
          field: "userZoneId",
          name: "user_zone_id"
        }
      });
    };
  }
  Departure.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      departureDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      descriptionDeparture: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Departure"
    }
  );
  return Departure;
};
