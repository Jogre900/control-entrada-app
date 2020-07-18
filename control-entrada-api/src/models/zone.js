export default (sequelize, { UUID, UUIDV4, STRING, DATE }) => {
  const Zone = sequelize.define("Zone", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    name: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    firsEntryTime: {
      type: DATE,
      allowNull: true,
    },
    SecondEntryTime: {
      type: DATE,
      allowNull: true,
    },
    firsDepartureTime: {
      type: DATE,
      allowNull: true,
    },
    SecondDepartureTime: {
      type: DATE,
      allowNull: true,
    },
  });
  Zone.associate = (models) => {
    Zone.hasMany(models.destination, {
      foreignKey: {
        name: "zoneId",
        field: "zone_id",
      },
      as: "ZoneId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Zone.hasMany(models.userZone, {
        foreignKey: {
            name: 'ZoneId',
            field: 'zone_id'
        },
        as: 'zoneId'
    })
  };
  return Zone;
};
