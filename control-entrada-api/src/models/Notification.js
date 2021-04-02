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
      this.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "user"
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
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      triggerId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      targetId:{
        type: DataTypes.UUID,
        allowNull: true,
      }

    },
    {
      sequelize,
      modelName: "Notification"
    }
  );

  return Notification;
};
