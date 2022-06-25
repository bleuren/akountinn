const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: 'user' });
      this.belongsTo(models.Category, { as: 'category' });
      this.belongsTo(models.Team, { as: 'team' });
    }
  }
  Record.init({
    title: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    remark: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    txAt: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Record',
  });
  return Record;
};
