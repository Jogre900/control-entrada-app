export default (sequelize, { UUID, UUIDV4, DATE }) => {
  const UserZone = sequelize.define("UserZone", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    assignationDate: {
      type: DATE,
      allowNull: true
    },
    changeTurnDate: {
      type: DATE,
      allowNull: true
    }
  });
  UserZone.associate = models => {
    UserZone.hasMany(models.visits, {
      foreigKey: {
        field: "userZoneId",
        name: "user_zone_id"
      }
    });
    UserZone.belongsTo(models.employee);
    UserZone.belongsTo(models.zone);
    UserZone.belongsTo(models.User);
  };
  return UserZone;
};
