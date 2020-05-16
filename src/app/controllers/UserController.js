module.exports = {
  registerForm(req, res) {
    try {
      return res.render("users/register")
    } catch (error) {
      console.log(erro);
    }
  },
  async saveOrUpdate(req, res) {
    const keys = Object.keys(req.body)
    const { id } = req.body
    let results;
    let productId;

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send('Por favor, Preencha todos os campos!')
      }
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",")
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)
      const removedFilesPromisse = removedFiles.map(id => File.delete(id))
      await Promise.all(removedFilesPromisse);
    }

    if (req.files.length == 0 && !id) {
      return res.send('Por favor, Envie pelo menos uma imagem!')
    }

    req.body.price = req.body.price.replace(/\D/g, "")

    if (id) {
      const oldProduct = await Product.find(id);
      const { price } = oldProduct.rows[0];

      if (price != req.body.price) {
        req.body.old_price = price
      }
      results = await Product.update(req.body);
    } else {
      results = await Product.create(req.body);
    }
    productId = results.rows[0].id;

    const filesPromise = req.files.map(file => File.create({
      ...file, product_id: productId
    }))

    await Promise.all(filesPromise)

    return res.redirect(`products/${productId}`)
  },
  async edit(req, res) {
    const { id } = req.params
    let results = await Product.find(id);

    const product = results.rows[0];

    if (!product) return res.send("Produto não encontrado")

    product.price = product.price ? formatPrice(product.price) : product.price

    results = await Category.all();

    const categories = results.rows

    results = await Product.file(product.id);
    let files = results.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    }))

    return res.render("products/create.njk", { product, categories, files })

  },
  async delete(req, res) {
    const { id } = req.body
    await Product.delete(id);
    return res.send("deletado")
  },
  async show(req, res) {
    const { id } = req.params
    let result = await Product.find(id);
    let product = result.rows[0]

    if (!product) return res.send("Produto não encontrado")

    product.price = product.price ? formatPrice(product.price) : product.price
    product.old_price = product.old_price ? formatPrice(product.old_price) : product.old_price
    product.updated_at = moment(product.updated_at).format('DD/MM/YYYY [ás] H').concat("h")
    results = await Product.file(product.id);
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    }))

    return res.render("products/show", { product, files })
  }
}