const Base = require("./Base")
const db = require("../../config/db")

Base.init({ table: 'products' })

module.exports = {
  ...Base,
  async file(id) {
    const results = await db.query(`SELECT * FROM files WHERE product_id = ${id}`)
    return results.rows
  },
  async search(params) {
    const { filter, category } = params
    let query = "",
      filterQuery = `WHERE`;

    if (category) {
      filterQuery = `${filterQuery}
      p.category_id = ${category} 
      AND
      `
    }

    filterQuery = `${filterQuery}
    ( p.name ilike '%${filter}%' or p.description ilike '%${filter}%' )`

    query = `    SELECT p.*,  c.name as category_name from products p 
    left JOIN categories c on (c.id = p.category_id)
    ${filterQuery}    
    order by p.updated_at desc
    `
    const results = await db.query(query);
    return results.rows;
  }
}