const db = require("../../config/db")
const { hash } = require("bcrypt")
const Product = require("../models/Product")
const fs = require("fs")
module.exports = {
  async create(data) {
    const query = `
        INSERT INTO users (                        
            name,            
            email,
            password,
            cpf_cnpj,
            cep,
            adress
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `
    const passwordHash = await hash(data.password, 8)

    const values = [
      data.name,
      data.email,
      passwordHash,
      data.cpf_cnpj,
      data.cep,
      data.adress
    ]
    return await db.query(query, values)
  },
  async findBy(email, cpf_cnpj) {
    return await db.query(`SELECT * FROM users WHERE (email = '${email}' or cpf_cnpj = '${cpf_cnpj}') `)
  },
  async update(id, fields) {
    let query = "UPDATE users SET"

    Object.keys(fields).map((key, index, array) => {
      if ((index + 1) < array.length) {
        query = `${query} ${key} = '${fields[key]}',`
      } else {
        // ultima interação
        query = `${query}
                ${key} = '${fields[key]}'
                WHERE id = ${id}
            `
      }
    })
    return await db.query(query)
  },
  async delete(id) {
    let results = await db.query("SELECT * FROM products WHERE user_id =$1", [id]);
    const products = results.rows

    const allFilesPromise = products.map(product => Product.file(product.id))

    let promiseResults = await Promise.all(allFilesPromise)

    await db.query(`DELETE FROM users WHERE ID = ${id}`)

    promiseResults.map(results => {
      results.rows.map(file => fs.unlinkSync(file.path))
    })

    return
  },
  findOne(id) {
    return db.query(`SELECT * FROM users WHERE id = ${id} `)
  },
}