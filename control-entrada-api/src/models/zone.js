import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Zone extends Model {
    static associate = models => {
      this.hasMany(models.Destination, {
        foreignKey: {
          name: "zoneId",
          field: "zone_id"
        },
        as: "Destinos",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      this.hasMany(models.UserZone, {
        foreignKey: {
          name: "ZoneId",
          field: "zone_id"
        },
        as: "encargado_zona",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      this.belongsTo(models.Company);
    };
  }
  Zone.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      zone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      firsEntryTime: {
        type: DataTypes.TIME,
        allowNull: true
      },
      SecondEntryTime: {
        type: DataTypes.TIME,
        allowNull: true
      },
      firsDepartureTime: {
        type: DataTypes.TIME,
        allowNull: true
      },
      SecondDepartureTime: {
        type: DataTypes.TIME,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Zone"
    }
  );
  return Zone;
};
