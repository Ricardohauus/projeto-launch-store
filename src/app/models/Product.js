const db = require("../../config/db")

module.exports = {
  create(data) {
    const query = `
        INSERT INTO products (
            category_id,
            user_id,
            name,
            description,
            old_price,
            price,
            quantity,
            status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `
    data.price = data.price.replace(/\D/g, "")

    const values = [
      data.category_id,
      data.user_id || 1,
      data.name,
      data.description,
      data.old_price || data.price,
      data.price,
      data.quantity,
      data.status || 1
    ]

    return db.query(query, values)
  },
  find(id) {
    return db.query(`SELECT * FROM products WHERE ID = ${id}`)
  },
  update(data) {
    const query = `
        UPDATE products SET
            category_id = $1,
            user_id = $2,
            name = $3,
            description = $4,
            old_price = $5,
            price = $6,
            quantity = $7,
            status = $8
        where id = $9
        RETURNING id
    `
    const values = [
      data.category_id,
      data.user_id || 1,
      data.name,
      data.description,
      data.old_price || data.price,
      data.price,
      data.quantity,
      data.status || 1,
      data.id
    ]

    return db.query(query, values)
  },
  delete(id) {
    return db.query(`DELETE FROM products WHERE ID = ${id}`)
  },
  file(id) {
    return db.query(`SELECT * FROM files WHERE product_id = ${id}`)
  },
  all() {
    return db.query(`SELECT * FROM products order by updated_at desc`)
  },
  search(params) {
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
    return db.query(query)
  }
}