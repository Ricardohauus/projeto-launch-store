const User = require("../models/User")
const { formatCep, formatCPfCnpj } = require("../lib/utils")
module.exports = {
  registerForm(req, res) {
    try {
      return res.render("users/register")
    } catch (error) {
      console.log(error);
    }
  },
  async saveOrUpdate(req, res) {
    try {
      var user = req.body
      let results;
      const keys = Object.keys(user)
      for (key of keys) {
        if (user[key] == "") {
          return res.render('users/register', { error: 'Por favor, Preencha todos os campos!', user })
        }
      }

      if (user.id) {
        user.cpf_cnpj = user.cpf_cnpj.replace(/\W/g, "");
        user.cep = user.cep.replace(/\W/g, "");
        results = await User.update(user);
      } else {

        if (user.password != user.passwordRepeat) {
          return res.render('users/register', { error: 'As senhas não conferem!', user })
        }

        results = await User.findBy(user.email, user.cpf_cnpj);

        if (results.rows.length > 0) {
          return res.render('users/register', { error: 'Usuário já cadastrado!', user })
        }

        user.cpf_cnpj = user.cpf_cnpj.replace(/\W/g, "");
        user.cep = user.cep.replace(/\W/g, "");
        results = await (await User.create(user)).rows[0].id;
        req.session.userId = results;
        return res.redirect(`/users`)
      }

    } catch (error) {
      console.log(error);
      return res.render('users/register', { error, user })
    }
  },
  async delete(req, res) {
    const { id } = req.body
    await User.delete(id);
    return res.send("deletado")
  },
  async show(req, res) {
    try {
      const { userId: id } = req.session

      let results = await User.findOne(id);

      var user = results.rows[0];

      if (!user) return res.render('users/register', { error: "Usuário não encontrado!", user })
      user.cep = formatCep(user.cep);
      user.cpf_cnpj = formatCPfCnpj(user.cpf_cnpj);
      return res.render("users/register.njk", { user })
    } catch (error) {
      console.log(error);
      return res.render('users/register.njk', { error, user })
    }

  }
}