import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class NotificationRead extends Model {
    static associate = models => {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "user"
      });
      NotificationRead.belongsTo(models.Notification, {
        foreignKey: {
          name: "notificationId",
          field: "notification_id"
        },
        as: "notification"
      });
    };
  }
  NotificationRead.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "NotificationRead"
    }
  );

  return NotificationRead;
};
