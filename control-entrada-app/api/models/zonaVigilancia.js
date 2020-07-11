export default (sequelize, { UUID, UUIDV4, STRING, DATE }) => {
  const ZonaVigilancia = sequelize.define("ZonaVigilancia", {
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
    zona: {
      type: STRING,
      allowNull: false,
    },
    hora_entrada_inicio: {
      type: DATE,
      allowNull: true,
    },
    hora_entrada_fin: {
      type: DATE,
      allowNull: true,
    },
    hora_salida_inicio: {
      type: DATE,
      allowNull: true,
    },
    hora_salida_fin: {
      type: DATE,
      allowNull: true,
    },
  });

  return ZonaVigilancia;
};
