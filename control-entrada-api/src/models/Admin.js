import { encrypt, makeid } from "@utils/security";

export default (sequelize, { BOOLEAN, STRING, UUID, UUIDV4, ENUM }) => {
  const Admin = sequelize.define(
    "Amin",
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: UUID,
        defaultValue: UUIDV4()
      },
      name: {
        type: STRING,
        allowNull: false
      },
      lastName: {
        type: STRING,
        allowNull: false
      },
      dni: {
        type: STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email"
          }
        }
      },
      password: {
        type: STRING,
        allowNull: false
      },
      pin: {
        type: STRING,
        allowNull: false,
        defaultValue: makeid(4)
      },
      picture: {
        type: STRING,
        allowNull: false
      },
      privilege: {
        type: STRING,
        allowNull: false,
        // values: ["Admin", "Supervisor", "Watchmen"],
        // defaultValue: "Admin"
      },
      active: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      tokenActivation: {
        type: STRING,
        allowNull: false,
        defaultValue: makeid(6)
      }
    },
    // {
    //   hooks: {
    //     beforeCreate: user => {
    //       user.password = encrypt(user.password);
    //     }
    //   }
    // }
  );

  Admin.associate = models => {
    /*    User.belongsTo(models.Provider, {
      foreignKey: {
        name: "providerId",
        field: "provider_id"
      },
      as: "provider",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });*/
    Admin.hasMany(models.NotificationRead, {
      foreignKey: {
        name: "userId",
        field: "user_id"
      },
      as: "notificationUsers",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    
    Admin.hasMany(models.company, {
        foreignKey: {
            name: "adminId",
            field: 'admin_id'
        },
        as: 'Admin'
    })
  };

  return Admin;
};
