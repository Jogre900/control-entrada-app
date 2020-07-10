/**
 * id
 * clientId
 * productId
 * changeCode
 * expirationDate
 * status
 */

export default (sequelize, { UUID, UUIDV4, BOOLEAN }) => {
  const NotificationRead = sequelize.define("NotificationRead", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4()
    },
    read: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  NotificationRead.associate = models => {
    NotificationRead.belongsTo(models.User, {
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

  return NotificationRead;
};
