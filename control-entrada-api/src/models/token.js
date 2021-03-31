import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate = models => {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "User",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    };
  }
  Token.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: "Token"
    }
  );

  return Token;
};
