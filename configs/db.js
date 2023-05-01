const { Sequelize } = require("sequelize");
const config = require("./variable");

const dbConfig = config;
console.log(dbConfig);
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    // sequelize
    //   .sync({ force: true })
    //   .then(() => {
    //     console.log("Table users created");
    //   })
    //   .catch((err) => {
    //     console.error("Unable to create table", err);
    //   });
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;
