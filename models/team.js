const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Team.init({
    name: DataTypes.STRING,
    owner: DataTypes.INTEGER,
    member: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};
