const db = require("../../config/db")
const { hash } = require("bcrypt")
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
    return db.query(`SELECT * FROM users WHERE (email = '${email}' or cpf_cnpj = '${cpf_cnpj}') `)
  },
  update(data) {
    const query = `
        UPDATE users SET
            name = $1,
            email = $2,            
            cpf_cnpj = $3,
            cep = $4,
            adress = $5
        where id = $6
        
    `

    const values = [
      data.name,
      data.email,
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