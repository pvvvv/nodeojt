'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class scheduler extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  scheduler.init({
    calendarId: {
      primaryKey: true,
      autoIncrement: true,
      type : DataTypes.INTEGER(8),
    },
    title: {
      allowNull : false,
      type : DataTypes.STRING(50),
    },
    category:{
      allowNull : false,
      type : DataTypes.STRING(10),
    },
    startDate: {
      allowNull : false,
      type : DataTypes.DATE,
    },
    endDate: {
      allowNull : false,
      type : DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'scheduler',
    freezeTableName: true, // 테이블명 복수형으로 만들지않기
  });
  return scheduler;
};