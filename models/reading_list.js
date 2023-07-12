const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class ReadingLists extends Model {}

ReadingLists.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' }
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'readingLists'
  }
);

module.exports = ReadingLists;
