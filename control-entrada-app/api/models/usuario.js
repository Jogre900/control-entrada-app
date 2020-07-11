export default (sequelize, { UUID, UUIDV4, STRING, ENUM }) => {
  const Usuario = sequelize.define("Usuario", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    Dni: {
      type: STRING,
      allowNull: false,
    },
    Clave: {
      type: STRING,
      allowNull: false,
    },
    Tipo: {
      type: ENUM,
      allowNull: false,
    },
    Id_Empleado: {
      type: UUID,
      allowNull: false,
    },
  });

  return Usuario;
};
