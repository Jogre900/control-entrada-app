import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Picture extends Model {
    static associate = models => {
      this.belongsTo(models.Visits);
    };
  }
  Picture.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false
      },
      entry: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Picture"
    }
  );
  return Picture;
};
