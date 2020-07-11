export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Employee = sequelize.define("Employee", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    dni: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    lasName: {
      type: STRING,
      allowNull: false,
    },
    picture: {
      type: STRING,
      allowNull: false,
    },
    status: {
      type: STRING,
      allowNull: false,
    },
  });

  return Employee;
};
