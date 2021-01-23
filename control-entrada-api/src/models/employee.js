import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate = models => {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "User",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    };
  }
  Employee.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: false
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
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Active"
        // ["Active", "Suspended"]
      }
    },
    {
      sequelize,
      modelName: "Employee"
    }
  );
  return Employee;
};
