import { UUID, UUIDV4, STRING } from "sequelize";

export default () => {
  const Picture = sequelize.define("Picture", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    picture: {
      type: STRING,
      allowNull: false,
    },
    entry: {
      type: STRING,
      allowNull: false,
    },
  });
  return Picture;
};
