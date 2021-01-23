import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Visits extends Model {
    static associate = models => {
      this.hasMany(models.Picture, {
        foreignKey: {
          name: "visitsId",
          field: "visits_id"
        },
        as: "Fotos",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      this.belongsTo(models.Destination);
      this.belongsTo(models.Citizen);
      this.belongsTo(models.UserZone);
    };
  }
  Visits.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      entryDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      descriptionEntry: {
        type: DataTypes.STRING,
        allowNull: true
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
      modelName: "Visits"
    }
  );
  return Visits;
};
