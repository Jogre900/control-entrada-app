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
      this.hasOne(models.Departure, {
        foreignKey: {
          name: 'visitId',
          field: 'visit_id'
        },
        as: 'Salida',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.belongsTo(models.Destination, {
        foreignKey: {
          name: "destinationId",
          field: "destination_id"
        },
        as: "Destino"
      });
      this.belongsTo(models.Citizen, {
        foreignKey: {
          name: "citizenId",
          field: "citizen_id"
        },
        as: "Visitante",
      });
      this.belongsTo(models.UserZone, {
        foreigKey: {
          field: "userZoneId",
          name: "user_zone_id"
        }
      });
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
    },
    {
      sequelize,
      modelName: "Visits"
    }
  );
  return Visits;
};
