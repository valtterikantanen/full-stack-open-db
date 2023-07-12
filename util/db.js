const Sequelize = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

const { DATABASE_URL } = require('./config');

const sequelize = new Sequelize(DATABASE_URL);

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('Database connected');
  } catch (error) {
    console.log('Connecting database failed', error);
    return process.exit(1);
  }

  return null;
}

const migrationConf = {
  migrations: { glob: 'migrations/*.js' },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
};

async function runMigrations() {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map(mig => mig.name)
  });
}

async function rollbackMigration() {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
}

module.exports = { connectToDatabase, sequelize, rollbackMigration };
