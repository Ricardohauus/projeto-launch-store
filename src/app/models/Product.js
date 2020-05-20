const Base = require("./Base")
const db = require("../../config/db")

Base.init({ table: 'products' })

module.exports = {
  ...Base,
  async file(id) {
    const results = await db.query(`SELECT * FROM files WHERE product_id = ${id}`)
    return results.rows
  },
  async search({ filter, category }) {
    let query = ` SELECT p.*,  c.name as category_name from products p
    left JOIN categories c on (c.id = p.category_id)
    WHERE 1=1 `;


    if (category) {
      query += ` AND p.category_id = ${category} `
    }
    if (filter) {
      query += ` AND  ( p.name ilike '%${filter}%' 
      or p.description ilike '%${filter}%' ) and status != 0 `
    }
    query += " order by p.updated_at desc "
    console.log(query);

    const results = await db.query(query);
    return results.rows;
  }
}