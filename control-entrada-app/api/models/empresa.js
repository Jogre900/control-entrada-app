export default (
  sequelize,
  { UUID, UUIDV4, STRING }
) => {
  const Empresa = sequelize.define("Empresa", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
    },
    rif_dni: {
      type: STRING,
      allowNull: true,
    },
  });

  return Empresa;
};
