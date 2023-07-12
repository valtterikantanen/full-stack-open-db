const { DataTypes } = require('sequelize');

module.exports = {
  up: async function ({ context: queryInterface }) {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER
    });
  },
  down: async function ({ context: queryInterface }) {
    await queryInterface.removeColumn('blogs', 'year');
  }
};
