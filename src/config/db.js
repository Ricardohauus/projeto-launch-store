const { Pool } = require("pg")

module.exports = new Pool({
  user: "root",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "launchstoredb"
})