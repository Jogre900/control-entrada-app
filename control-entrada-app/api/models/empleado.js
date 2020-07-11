export default (sequelize, { UUID, UUIDV4, STRING, ENUM }) => {
  const Empleado = sequelize.define("Empleado", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    id_empresa: {
      type: UUID,
      allowNull: false,
    },
    dni: {
      type: STRING,
      allowNull: false,
    },
    nombres: {
      type: STRING,
      allowNull: false,
    },
    apellidos: {
      type: STRING,
      allowNull: false,
    },
    foto: {
      type: STRING,
      allowNull: false,
    },
    status: {
      type: ENUM,
      allowNull: false,
    },
  });

  return Empleado;
};
