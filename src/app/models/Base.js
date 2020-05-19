const db = require("../../config/db")
function find(filters, table) {
  let query = `SELECT * FROM ${table}`;

  Object.keys(filters).map(key => {
    query += key

    Object.keys(filters[key]).map(field => {
      query += `${field} = '${filters[key][field]}'`
    })
  })

  const results = db.query(query);
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
      return
    }
  },
  async findOne(filters) {
    try {
      const results = await find(filters, this.table)
      return results.rows[0]
    } catch (error) {
      console.log(error);
      return
    }
  },
  async findAll(filters) {
    try {
      const results = await find(filters, this.table)
      return results.rows
    } catch (error) {
      console.log(error);
      return
    }
  },
  async create(fields) {
    try {
      let keys = [], values = [];
      Object.keys(fields).map(key => {
        keys.push(key)
        values.push(fields[key])
      })
      const query = `INSERT INTO ${this.table} (${keys.join(',')})
      VALUES (${values.join(',')})
      RETURNING id`
      const results = await db.query(query)
      return results.rows[0]
    } catch (error) {
      console.log(error);
      return
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

      return db.query(query)
    } catch (error) {
      console.log(error);
      return;
    }


  },
  delete(id) {
    return db.query(`DELETE FROM ${this.table} WHERE ID = ${id}`)
  }
}

module.exports = Base