const Base = require("./Base")

Base.init({ table: 'files' })

module.exports = {
  ...Base,
}
  // async delete(id) {
  //   try {
  //     const results = await db.query(`SELECT * FROM files where id = ${id}`)
  //     const file = results.rows[0]
  //     fs.unlinkSync(file.path)
  //     return db.query(`DELETE FROM files WHERE ID = ${id}`)
  //   } catch (error) {
  //     console.log("Caiu aqui" + error);
  //     return;
  //   }

  // },
