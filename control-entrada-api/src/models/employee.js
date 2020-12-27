export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Employee = sequelize.define("Employee", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    dni: {
      type: STRING,
      allowNull: false
    },
    name: {
      type: STRING,
      allowNull: false
    },
    lastName: {
      type: STRING,
      allowNull: false
    },
    picture: {
      type: STRING,
      allowNull: true
    },
    status: {
      type: STRING,
      allowNull: false,
      defaultValue: "Active"
      // ["Active", "Suspended"]
    }
  });
  Employee.associate = models => {
    Employee.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      },
      as: "User",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  };
  return Employee;
};
