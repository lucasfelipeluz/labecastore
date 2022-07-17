const { Model, DataTypes } = require("sequelize");

module.exports = (connectionOption) => {
  class Products extends Model {}
  Products.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      inventoryPP: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventoryP: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventoryM: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventoryG: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventoryGG: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventoryEG: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventoryEGG: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BLOB,
        allowNull: false,
        defaultValue: 1,
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
      modelName: "products",
      timestamps: true,
    }
  );
  return Products;
};
