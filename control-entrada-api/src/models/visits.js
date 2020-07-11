import { UUID, UUIDV4, DATE, STRING } from "sequelize";

export default (sequelize, { UUID, UUIDV4, STRING, DATE }) => {
  const Visits = sequelize.define("Visits", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    entryDate: {
      type: DATE,
      allowNull: false,
    },
    descriptionEntry: {
      type: STRING,
      allowNull: true,
    },
    departureDate: {
      type: DATE,
      allowNull: false,
    },
    descriptionDeparture: {
      type: STRING,
      allowNull: true,
    },
  });
  Visits.associate = (models) => {
    Visits.hasMany(models.picture, {
      foreignKey: {
        name: "visitsId",
        field: "visits_id",
      },
      as: "VisitsId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Visits;
};
