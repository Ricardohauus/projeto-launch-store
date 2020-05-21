const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) return res.render("sessions/index", {
    user: req.body,
    error: "Usuário não cadastrado!"
  })

  const passed = await compare(password, user.password)

  if (!passed) return res.render("sessions/index", {
    user: req.body,
    error: "Senha incorreta!"
  })

  req.user = user

  next()
}

async function forgot(req, res, next) {
  const { email } = req.body

  try {
    let user = await User.findOne({ where: { email } })

    if (!user) return res.render("sessions/forgot-password", {
      user: req.body,
      error: "Email não cadastrado!"
    })

    req.user = user

    next()
  } catch (err) {
    console.error(err)
  }
}

async function reset(req, res, next) {
  const { email, password, token, passwordRepeat } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) return res.render("sessions/password-reset", {
    user: req.body,
    token,
    error: "Usuário não cadastrado!"
  })

  // VERIFICA SE AS SENHAS ESTÃO IGUAIS 
  if (password != passwordRepeat) return res.render('sessions/password-reset', {
    user: req.body,
    token,
    error: 'As senhas não conferem!'
  })

  // VERIFICA SE O TOKEN É VALIDO
  if (token != user.reset_token) return res.render('sessions/password-reset', {
    user: req.body,
    token,
    error: 'Token inválido! Solicite uma nova recuperação de senha.'
  })

  // VERIFICA SE O TOKEN ESTÁ EXPIRADO
  let now = new Date()
  now = now.setHours(now.getHours())

  if (now > user.reset_token_expires) return res.render('sessions/password-reset', {
    user: req.body,
    token,
    error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
  })

  req.user = user

  next()

}
module.exports = {
  login,
  forgot,
  reset
}