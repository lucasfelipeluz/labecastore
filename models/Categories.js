const { Model, DataTypes } = require("sequelize");

module.exports = (connectionOption) => {
  class Categories extends Model {}
  Categories.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connectionOption,
      modelName: "categories",
      timestamps: true,
    }
  );
  return Categories;
};
