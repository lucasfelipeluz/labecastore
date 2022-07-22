const { Model, DataTypes } = require("sequelize");
const Products = require("./Products");
const ProductsCategories = require("./ProductsCategories");

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
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
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
