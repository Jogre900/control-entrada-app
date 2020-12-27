export default (sequelize, { BOOLEAN, STRING, UUID, UUIDV4 }) => {
  const UserCompany = sequelize.define("UserCompany", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    privilege: {
      type: STRING,
      allowNull: false
      // values: ["Root","Admin", "Supervisor", "Watchmen"],
    },
    active: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  UserCompany.associate = models => {
    UserCompany.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      },
      as: "User"
    });
    UserCompany.belongsTo(models.company, {
      foreignKey: {
        name: "companyId",
        field: "company_id"
      },
      as: "Company"
    });
  };

  return UserCompany;
};
