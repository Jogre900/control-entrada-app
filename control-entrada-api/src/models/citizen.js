export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Citizen = sequelize.define("Citizen", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    dni: {
      type: STRING,
      allowNull: false,
      unique: true
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
      allowNull: false
    }
  });
  Citizen.associate = models => {
    Citizen.hasMany(models.visits, {
      foreignKey: {
        name: "citizenId",
        field: "citizen_id"
      },
      as: "citizenId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  };
  return Citizen;
};
