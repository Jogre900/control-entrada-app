export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Destination = sequelize.define("Destination", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    name: {
      type: STRING,
      allowNull: false
    }
  });
  Destination.associate = models => {
    Destination.hasMany(models.visits, {
      foreignKey: {
        name: "destinationId",
        field: "destination_id"
      }
    })
    Destination.associate = (models) => {
      Destination.belongsTo(models.zone)
    }
  };
  return Destination;
};
