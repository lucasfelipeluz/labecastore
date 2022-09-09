const { Model, DataTypes } = require('sequelize');

module.exports = (connectionOption) => {
  class HitsProducts extends Model {}
  HitsProducts.init(
    {
      number_of_hits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize: connectionOption,
      modelName: 'hits_products',
      timestamps: true,
    },
  );

  return HitsProducts;
};
