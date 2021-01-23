import { Model } from "sequelize";
import { encrypt, makeid } from "@utils/security";

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate = models => {
      /*    User.belongsTo(models.Provider, {
        foreignKey: {
          name: "providerId",
          field: "provider_id"
        },
        as: "provider",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });*/
      this.hasOne(models.Employee, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "Employee",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      this.hasMany(models.UserCompany, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "UserCompany",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      this.hasMany(models.NotificationRead, {
        foreignKey: {
          name: "userId",
          field: "user_id"
        },
        as: "notificationUsers",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      this.hasMany(models.UserZone, {
        foreignKey: {
          name: "UserId",
          field: "user_id"
        },
        as: "userZone",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    };
  }
  User.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4()
      },
      email: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false
      },
      pin: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: makeid(4)
      },
      tokenActivation: {
        type: DataTypes.STRING,
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
  {
    sequelize,
    modelName: 'User'
  });

  return User;
};
