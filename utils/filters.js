// Models
const Categories = require('../models/Categories');
const HitsProducts = require('../models/HitsProducts');
const Images = require('../models/Images');

const productFilters = (connectionOption, req) => {
  const { active, year, limit } = req.query;
  const { id } = req.params;

  let limitDefault = 20;
  if (limit !== undefined) {
    limitDefault = parseInt(limit);
  }

  let filters = {
    include: [
      {
        model: Categories(connectionOption),
      },
      {
        model: Images(connectionOption),
      },
      {
        model: Images(connectionOption),
        as: 'img_main',
      },
      {
        model: HitsProducts(connectionOption),
        as: 'hits',
        attributes: { exclude: ['id', 'id_product'] },
      },
    ],
    where: {},
    order: [['id', 'DESC']],
    limit: limitDefault,
  };

  if (active) {
    filters.where['active'] = active === 'true' ? true : false;
  }
  if (year) {
    filters.where['year'] = year;
  }
  if (id) {
    filters.where['id'] = id;
  }

  return filters;
};

const categoriesFilters = (connectionOption, req) => {
  const { id, active, slug } = req.query;

  let filters = {
    where: {},
    order: [['id', 'DESC']],
  };

  if (active) {
    filters.where['active'] = active === 'true' ? true : false;
  }
  if (slug) {
    filters.where['slug'] = slug;
  }
  if (id) {
    filters.where['id'] = id;
  }

  return filters;
};

const imagesFilters = (connectionOption, req) => {
  const { id, active, filename, main } = req.query;

  let filters = {
    where: {},
    order: [['id', 'DESC']],
  };

  if (active) {
    filters.where['active'] = active === 'true' ? true : false;
  }
  if (filename) {
    filters.where['filename'] = filename;
  }
  if (id) {
    filters.where['id'] = id;
  }
  if (main) {
    filters.where['main'] = main === 'true' ? true : false;
  }

  return filters;
};

const productPublicFilters = (connectionOption, req) => {
  const { id, active, year, category, image, limit } = req.query;

  let limitDefault = 20;
  if (limit !== undefined) {
    limitDefault = parseInt(limit);
  }

  let filters = {
    include: [
      {
        model: Categories(connectionOption),
      },
      {
        model: Images(connectionOption),
      },
      {
        model: Images(connectionOption),
        as: 'img_main',
      },
      {
        model: HitsProducts(connectionOption),
        as: 'hits',
        attributes: { exclude: ['id', 'id_product'] },
      },
    ],
    where: {},
    order: [['id', 'DESC']],
    limit: limitDefault,
  };

  if (active) {
    filters.where['active'] = active === 'true' ? true : false;
  }
  if (year) {
    filters.where['year'] = year;
  }
  if (id) {
    filters.where['id'] = id;
  }
  if (category) {
    filters.where['$categories.id$'] = parseInt(category);
  }
  if (image) {
    filters.where['$images.id$'] = image;
  }

  return filters;
};

const productPublicMoreAcessFilters = (connectionOption, req) => {
  const { id, active, year, category, image, limit } = req.query;

  let limitDefault = 20;
  if (limit !== undefined) {
    limitDefault = parseInt(limit);
  }

  let filters = {
    include: [
      {
        model: Categories(connectionOption),
      },
      {
        model: Images(connectionOption),
      },
      {
        model: Images(connectionOption),
        as: 'img_main',
      },
      {
        model: HitsProducts(connectionOption),
        as: 'hits',
        attributes: { exclude: ['id', 'id_product'] },
      },
    ],
    where: {},
    order: [[{ model: HitsProducts(connectionOption), as: 'hits' }, 'number_of_hits', 'DESC']],
    limit: limitDefault,
  };

  if (active) {
    filters.where['active'] = active === 'true' ? true : false;
  }
  if (year) {
    filters.where['year'] = year;
  }
  if (id) {
    filters.where['id'] = id;
  }
  if (category) {
    filters.where['$categories.id$'] = parseInt(category);
  }
  if (image) {
    filters.where['$images.id$'] = image;
  }

  return filters;
};

const productBySlugFilters = (connectionOption, req) => {
  const { active, year, limit } = req.query;
  const { slug } = req.params;

  let limitDefault = 20;
  if (limit !== undefined) {
    limitDefault = parseInt(limit);
  }

  let filters = {
    include: [
      {
        model: Categories(connectionOption),
        where: {
          slug: slug
        }
      },
      {
        model: Images(connectionOption),
      },
      {
        model: Images(connectionOption),
        as: 'img_main',
      },
      {
        model: HitsProducts(connectionOption),
        as: 'hits',
        attributes: { exclude: ['id', 'id_product'] },
      },
    ],
    where: {},
    order: [['id', 'DESC']],
    limit: limitDefault,
  };

  if (active) {
    filters.where['active'] = active === 'true' ? true : false;
  }
  if (year) {
    filters.where['year'] = year;
  }

  return filters;
};

module.exports = {
  productFilters,
  categoriesFilters,
  imagesFilters,
  productPublicFilters,
  productPublicMoreAcessFilters,
  productBySlugFilters
};
