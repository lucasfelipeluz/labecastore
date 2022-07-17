const { Model, DataTypes } = require("sequelize");

module.exports = (connectionOption) => {
  class Images extends Model {}
  Images.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BLOB,
        allowNull: false,
        defaultValue: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
    },
    {
      sequelize: connectionOption,
      modelName: "images",
      timestamps: true,
    }
  );
  return Images;
};
