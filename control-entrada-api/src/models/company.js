const {Model} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate = models => {
      // Company.hasMany(models.employee, {
      //   foreignKey: {
      //     name: "companyId",
      //     field: "company_id",
      //   },
      //   as: "Empleado",
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE",
      // });
      this.hasMany(models.Zone, {
        foreignKey: {
          name: "companyId",
          field: "company_id"
        },
        as: "companyZone",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      this.hasMany(models.UserCompany, {
        foreignKey: {
          name: "companyId",
          field: "company_id"
        },
        as: "UserCompany",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    };
  }
  Company.init({
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4()
    },
    companyName: {
      allowNull: true,
      type: DataTypes.STRING
    },
    businessName: {
      allowNull: true,
      type: DataTypes.STRING
    },
    nic: {
      allowNull: true,
      type: DataTypes.STRING
    },
    city: {
      allowNull: true,
      type: DataTypes.STRING
    },
    address: {
      allowNull: true,
      type: DataTypes.STRING
    },
    phoneNumber: {
      allowNull: true,
      type: DataTypes.STRING
    },
    phoneNumberOther: {
      allowNull: true,
      type: DataTypes.STRING
    },
    logo: {
      allowNull: true,
      type: DataTypes.STRING
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Company'
  });  
  return Company;
};
