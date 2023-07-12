const { DataTypes } = require('sequelize');

module.exports = {
  up: async function ({ context: queryInterface }) {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    });
  },
  down: async function ({ context: queryInterface }) {
    await queryInterface.removeColumn('users', 'disabled');
  }
};
