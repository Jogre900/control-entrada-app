import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate = models => {
      this.hasMany(models.NotificationRead, {
        foreignKey: {
          name: "notificationId",
          field: "notification_id"
        },
        as: "notificationRead",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    };
  }
  Notification.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      notificationType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      notification: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Notification"
    }
  );

  return Notification;
};
