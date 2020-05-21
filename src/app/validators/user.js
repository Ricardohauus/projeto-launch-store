const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: 'Por favor, Preencha todos os campos!'
      }
    }
  }
}


async function show(req, res, next) {
  const { userId: id } = req.session

  const user = await User.findOne({ where: { id } })

  if (!user) return res.render("users/register", {
    error: "Usuário não encontrado!"
  })

  req.user = user

  next()
}
async function saveOrUpdate(req, res, next) {
  const fillAllFields = checkAllFields(req.body)

  if (fillAllFields) {
    return res.render("users/register", fillAllFields)
  }

  let { id, email, cpf_cnpj, password, passwordRepeat } = req.body

  cpf_cnpj = cpf_cnpj.replace(/\D/g, "")



  if (!id) {
    const user = await User.findOne({ where: { email }, or: { cpf_cnpj } });

    if (user) return res.render('users/register', {
      user: req.body,
      error: 'Usuário já cadastrado.'
    })

    if (password != passwordRepeat) return res.render('users/register', {
      user: req.body,
      error: 'As senhas não conferem!'
    })

  } else {
    const user = await User.findOne({ where: { id } })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("users/register", {
      user: req.body,
      error: "Senha incorreta!"
    })

    req.user = user
  }

  next()

}

module.exports = {
  saveOrUpdate,
  show,
}