const { Model, DataTypes } = require("sequelize");

module.exports = (connectionOption) => {
  class ProductsImages extends Model {}
  ProductsImages.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connectionOption,
      modelName: "products_images",
      timestamps: false,
    }
  );
  return ProductsImages;
};
