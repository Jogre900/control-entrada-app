import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class UserCompany extends Model {
    static associate = models => {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "User"
      });
      this.belongsTo(models.Company, {
        foreignKey: {
          name: "companyId",
          field: "company_id"
        },
        as: "Company"
      });
    };
  }
  UserCompany.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      privilege: {
        type: DataTypes.STRING,
        allowNull: false
        // values: ["Root","Admin", "Supervisor", "Watchmen"],
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      visits: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "UserCompany"
    }
  );

  return UserCompany;
};
