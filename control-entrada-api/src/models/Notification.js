/**
 * id
 * clientId
 * productId
 * changeCode
 * expirationDate
 * status
 */

export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Notification = sequelize.define("Notification", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    notificationType: {
      type: STRING,
      allowNull: false
    },
    notification: {
      type: STRING,
      allowNull: false
    }
  });

  Notification.associate = models => {
    Notification.hasMany(models.NotificationRead, {
      foreignKey: {
        name: "notificationId",
        field: "notification_id"
      },
      as: "notificationRead",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  };

  return Notification;
};
