class Products {
  index(req, res) {
    const pageName = 'Produtos';
    res.json({
      pageAttributes: {
        pageName,
      },
    });
  }
}

module.exports = new Products();
