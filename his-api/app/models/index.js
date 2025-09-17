//*************************************************************************************
// MSSQL Server Connection local

// MSSQL Server Connection
const Sequelize = require("sequelize");
//
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST, 
     //
    dialect: "mssql",
    pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
});

//console.log("Sequalize", sequelize)
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;

/*
const Sequelize = require("sequelize");
const sequelize = new Sequelize("IGP_AHMS", "sa", "p123", {
    host: "SERVER",
    dialect: "mssql",
    pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
*/
//*************************************************************************************
// MSSQL Server Connection rds1
/*
const Sequelize = require("sequelize");
const sequelize = new Sequelize("AWS_MSSQLDB", "admin", "bmw0Rk1VlECKu39KP5JB", {
    host: "database-1.c9wv7djy9lsj.us-east-2.rds.amazonaws.com",
    dialect: "mssql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
//*/

// MSSQL Server Connection local
///*

//*************************************************************************************
/*
//MySQL COnnection
const Sequelize = require("sequelize");
const sequelize = new Sequelize("mysqldb", "sysadmin", "yashanupam", {
    host: "database-1.c7gmw7jnbne5.us-east-2.rds.amazonaws.com123",
    port: 3306,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    pool: { maxConnections: 5, maxIdleTime: 30},
    language: 'en'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
*/
//*************************************************************************************