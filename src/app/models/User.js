const db = require("../../config/db")
const { hash } = require("bcrypt")
module.exports = {
  create(data) {
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
    const passwordHash = hash(data.password, 8)

    const values = [
      data.name,
      data.email,
      passwordHash,
      data.cpf_cnpj,
      data.cep,
      data.adress
    ]

    return db.query(query, values)
  },
  findBy(email, cpf_cnpj) {
    return db.query(`SELECT * FROM users WHERE (email = '${email}' or cpf_cnpj = '${cpf_cnpj}') `)
  },
  update(data) {
    const query = `
        UPDATE users SET
            name = $1,
            email = $2,
            password = $3,
            cpf_cnpj = $4,
            cep = $5,
            adress = $6
        where id = $7
        RETURNING id
    `
    const passwordHash = hash(data.password, 8)

    const values = [
      data.name,
      data.email,
      passwordHash,
      data.cpf_cnpj,
      data.cep,
      data.adress,
      data.id
    ]

    return db.query(query, values)
  },
  delete(id) {
    return db.query(`DELETE FROM users WHERE ID = ${id}`)
  },
  findOne(id) {
    return db.query(`SELECT * FROM users WHERE id = ${id} `)
  },
}