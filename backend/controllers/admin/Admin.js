class Admin {
  index(req, res) {
    const pageName = 'Administração La Beca';
    res.json({
      pageAttributes: {
        pageName,
      },
      links: {
        category: '/categories',
        product: '/products',
      },
    });
  }
}

module.exports = new Admin();
