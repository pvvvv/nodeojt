'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(models.scheduler, {foreignKey: "ID"});
      // define association here
    }
  };
  user.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull : false,
      type: DataTypes.STRING(30),
    },
    password: {
      allowNull : false,
      type : DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'user',
    freezeTableName: true, // 테이블명 복수형으로 만들지않기
  });
  return user;
};