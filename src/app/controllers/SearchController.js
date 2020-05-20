const Product = require("../models/Product")
const LoadProductService = require("../services/LoadProductService")

module.exports = {
    async index(req, res) {
        try {
            let params = {}

            let { filter, category } = req.query

            if (!filter || filter.toLowerCase() == 'toda a loja') filter = null

            params.filter = filter;
            if (category) {
                params.category = category;
            }

            let products = await Product.search({ filter, category })
            if (!products) { return res.send("Não há nenhum registro") }

            const productPromise = products.map(LoadProductService.format)
            products = await Promise.all(productPromise)

            const search = {
                term: filter || 'Toda a loja',
                total: products.length
            }

            const categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => {
                const found = categoriesFiltered.some(cat => cat.id == category.id)
                if (!found) categoriesFiltered.push(category)
                return categoriesFiltered
            }, [])

            return res.render("search/index", { products, search, categories })
        } catch (error) {
            console.log(error);
            return;
        }
    }
}