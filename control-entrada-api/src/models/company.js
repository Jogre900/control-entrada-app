export default (sequelize, { UUID, UUIDV4, STRING, BOOLEAN }) => {
  const Company = sequelize.define("Company", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    companyName: {
      allowNull: true,
      type: STRING
    },
    businessName: {
      allowNull: true,
      type: STRING
    },
    nic: {
      allowNull: true,
      type: STRING
    },
    city: {
      allowNull: true,
      type: STRING
    },
    address: {
      allowNull: true,
      type: STRING
    },
    phoneNumber: {
      allowNull: true,
      type: STRING
    },
    phoneNumberOther: {
      allowNull: true,
      type: STRING
    },
    logo: {
      allowNull: true,
      type: STRING
    },
    active: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  Company.associate = models => {
    // Company.hasMany(models.employee, {
    //   foreignKey: {
    //     name: "companyId",
    //     field: "company_id",
    //   },
    //   as: "Empleado",
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // });
    Company.hasMany(models.zone, {
      foreignKey: {
        name: "companyId",
        field: "company_id"
      },
      as: "companyZone",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    Company.hasMany(models.userCompany, {
      foreignKey: {
        name: "companyId",
        field: "company_id"
      },
      as: "UserCompany",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  };
  return Company;
};
