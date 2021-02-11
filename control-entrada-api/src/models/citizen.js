const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Citizen extends Model {
    static associate = models => {
      this.hasMany(models.Visits, {
        foreignKey: {
          name: "citizenId",
          field: "citizen_id"
        },
        as: "Visitas",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    };
  }
  Citizen.init({
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4()
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Citizen'
  })
  
  return Citizen;
};
