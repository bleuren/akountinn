const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate() {
      // define association here
    }
  }
  Category.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Category',
  });
  return Category;
};
