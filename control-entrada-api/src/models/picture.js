export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Picture = sequelize.define("Picture", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    picture: {
      type: STRING,
      allowNull: false,
    },
    entry: {
      type: STRING,
      allowNull: false,
    },
  })
  Picture.associate = models => {
    Picture.belongsTo(models.visits)
  }
  return Picture;
};
