const { Model, DataTypes } = require('sequelize');
const Categories = require('./Categories');
const Images = require('./Images');
const ProductsCategories = require('./ProductsCategories');
const ProductsImages = require('./ProductsImages');

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
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
    },
    {
      sequelize: connectionOption,
      modelName: 'products',
      timestamps: true,
    },
  );
  Products.belongsToMany(Categories(connectionOption), {
    through: {
      model: ProductsCategories(connectionOption),
    },
    foreignKey: 'productId',
    constraints: true,
  });

  Categories(connectionOption).belongsToMany(Products, {
    through: {
      model: ProductsCategories(connectionOption),
    },
    foreignKey: 'categoryId',
    constraints: true,
  });

  Products.belongsToMany(Images(connectionOption), {
    through: {
      model: ProductsImages(connectionOption),
    },
    foreignKey: 'productId',
    constraints: true,
  });

  Products.belongsTo(Images(connectionOption), {
    constraints: true,
    foreignKey: 'id_img_main',
    as: 'img_main',
  });

  Images(connectionOption).belongsToMany(Products, {
    through: {
      model: ProductsImages(connectionOption),
    },
    foreignKey: 'imageId',
    constraints: true,
  });

  return Products;
};
