const db = require("../../config/db")
function find(filters, table) {
  let query = `SELECT * FROM ${table} `;
  if (filters) {
    Object.keys(filters).map(key => {
      query += `${key}`

      Object.keys(filters[key]).map(field => {
        query += ` ${field} = '${filters[key][field]}' `
      })
    })
  }
  console.log(query);
  return db.query(query);
}
const Base = {
  init({ table }) {
    if (!table) throw new Error("Parametros inválidos")

    this.table = table
    return this;
  },
  async find(id) {
    try {
      const results = await find({ where: { id } }, this.table)
      return results.rows[0]
    } catch (error) {
      console.log(error);
    }
  },
  async findOne(filters) {
    try {
      const results = await find(filters, this.table)
      return results.rows[0]
    } catch (error) {
      console.log(error);
    }
  },
  async findAll(filters) {
    try {
      const results = await find(filters, this.table)
      return results.rows
    } catch (error) {
      console.log(error);
    }
  },
  async create(fields) {
    try {
      let keys = [], values = [];
      Object.keys(fields).map(key => {
        keys.push(key)
        values.push(`'${fields[key]}'`)
      })
      const query = `INSERT INTO ${this.table} (${keys.join(',')})
      VALUES (${values.join(',')})
      RETURNING id`
      console.log(query);
      const results = await db.query(query)
      return results.rows[0].id
    } catch (error) {
      console.log(error);
    }
  },
  update(id, fields) {
    try {
      let update = []

      Object.keys(fields).map(key => {
        const line = `${key} = '${fields[key]}'`
        update.push(line);
      })

      let query = `UPDATE ${this.table} SET
      ${update.join(',')} where id = ${id}`
      console.log(query);
      return db.query(query)
    } catch (error) {
      console.log(error);
    }


  },
  delete(id) {
    let query = `DELETE FROM ${this.table} WHERE ID = ${id}`;
    console.log(query);
    return db.query(query)
  }
}

module.exports = Base