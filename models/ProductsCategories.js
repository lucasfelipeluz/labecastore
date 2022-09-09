const { Model, DataTypes } = require('sequelize');

module.exports = (connectionOption) => {
  class ProductsCategories extends Model {}
  ProductsCategories.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connectionOption,
      modelName: 'products_categories',
      timestamps: false,
    },
  );
  return ProductsCategories;
};
