class Admin {
  index(req, res) {
    const pageName = 'Administração La Beca';
    res.json({
      pageAttributes: {
        pageName,
      },
      links: {
        category: '/category',
        product: '/product',
      },
    });
  }
}

module.exports = new Admin();
