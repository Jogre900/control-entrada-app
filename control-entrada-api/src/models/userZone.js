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
      this.belongsTo(models.Employee);
      this.belongsTo(models.Zone);
      this.belongsTo(models.User);
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
