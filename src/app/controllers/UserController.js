const User = require("../models/User")

module.exports = {
  registerForm(req, res) {
    try {
      return res.render("users/register")
    } catch (error) {
      console.log(error);
    }
  },
  async saveOrUpdate(req, res) {
    req.body.cpf_cnpj = req.body.cpf_cnpj.replace(/\W/g, "");

    const keys = Object.keys(req.body)
    const { id, email, cpf_cnpj, password, passwordRepeat } = req.body
    let results;

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send('Por favor, Preencha todos os campos!')
      }
    }


    if (id) {
      results = await User.update(req.body);
    } else {
      if (password != passwordRepeat) {
        return res.send('As Senhas não conferem!')
      }
      results = await User.findBy(email, cpf_cnpj);
      if (results.rows > 0) {
        return res.send('Usuário já existe!')
      }
      results = await User.create(req.body);
    }
    return res.redirect(`/`)
  },
  async edit(req, res) {
    const { id } = req.params

    let results = await User.find(id);

    const user = results.rows[0];

    if (!user) return res.send("Usuário não encontrado")

    return res.render("users/register.njk", { user })

  },
  async delete(req, res) {
    const { id } = req.body
    await User.delete(id);
    return res.send("deletado")
  },
  async show(req, res) {
    const { id } = req.params
    let result = await User.find(id);
    let user = result.rows[0]

    if (!user) return res.send("Produto não encontrado")

    return res.render("products/show", { user })
  }
}