async function saveOrUpdate(req, res, next) {
  const keys = Object.keys(req.body)
  let { id } = req.body
  for (key of keys) {
    if (req.body[key] == "" && key != "removed_files") {
      return res.send('Por favor, volte e preencha todos os campos.')
    }
  }

  if ((!req.files || req.files.length == 0) && (req.files.length == 0 && !id))
    return res.send('Por favor, envie pelo menos uma imagem.')

  next()
}

module.exports = {
  saveOrUpdate
}