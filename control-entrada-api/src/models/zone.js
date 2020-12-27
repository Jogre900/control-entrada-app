export default (sequelize, { UUID, UUIDV4, STRING, DATE, TIME }) => {
  const Zone = sequelize.define("Zone", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    zone: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    firsEntryTime: {
      type: TIME,
      allowNull: true
    },
    SecondEntryTime: {
      type: TIME,
      allowNull: true
    },
    firsDepartureTime: {
      type: TIME,
      allowNull: true
    },
    SecondDepartureTime: {
      type: TIME,
      allowNull: true
    }
  });
  Zone.associate = models => {
    Zone.hasMany(models.destination, {
      foreignKey: {
        name: "zoneId",
        field: "zone_id"
      },
      as: "Destinos",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    Zone.hasMany(models.userZone, {
      foreignKey: {
        name: "ZoneId",
        field: "zone_id"
      },
      as: "encargado_zona",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    Zone.belongsTo(models.company);
  };
  return Zone;
};
