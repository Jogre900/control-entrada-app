import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    static associate = models => {
      this.hasMany(models.Visits, {
        foreignKey: {
          name: "destinationId",
          field: "destination_id"
        },
        as: "Destino"
      });
      Destination.belongsTo(models.Zone, {
        foreignKey: {
          name: "zoneId",
          field: "zone_id"
        },
        as: "Zona",
      });
    };
  }
  Destination.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      visits: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Destination"
    }
  );
  return Destination;
};
