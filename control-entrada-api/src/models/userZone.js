import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class UserZone extends Model {
    static associate = models => {
      this.hasMany(models.Visits, {
        foreigKey: {
          field: "userZoneId",
          name: "user_zone_id"
        }
      });
      this.hasMany(models.Departure, {
        foreigKey: {
          field: "userZoneId",
          name: "user_zone_id"
        },
        as: 'Salida'
      });
      this.belongsTo(models.Zone, {
        foreignKey: {
          name: "ZoneId",
          field: "zone_id"
        },
        as: "Zona",
      });
      this.belongsTo(models.User, {
        foreignKey: {
          name: "UserId",
          field: "user_id"
        },
        as: "User",
      });
    };
  }
  UserZone.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      assignationDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      changeTurnDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "UserZone"
    }
  );

  return UserZone;
};
