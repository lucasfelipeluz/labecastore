class Admin {
  index(req, res) {
    res.json({
      links: {
        category: '/categories',
        product: '/products',
      },
    });
  }
}

module.exports = new Admin();
