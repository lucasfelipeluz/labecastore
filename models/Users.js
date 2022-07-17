const { Model, DataTypes } = require("sequelize");

module.exports = (connectionOption) => {
  class Users extends Model {}
  Users.init(
    {
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      active: {
        type: DataTypes.BLOB,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize: connectionOption,
      modelName: "users",
      timestamps: false,
    }
  );
  return Users;
};
