const { Model, DataTypes } = require('sequelize');

module.exports = (connectionOption) => {
  class Images extends Model {}
  Images.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      main: {
        type: DataTypes.BOOLEAN,
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
    },
    {
      sequelize: connectionOption,
      modelName: 'images',
      timestamps: true,
    },
  );
  return Images;
};
