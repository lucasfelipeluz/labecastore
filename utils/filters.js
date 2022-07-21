// Models
const Categories = require("../models/Categories");
const Products = require("../models/Products");
const Images = require("../models/Images");

const productFilters = (connectionOption, req) => {
  const { active, year } = req.query;
  const { id } = req.params;

  let filters = {
    include: [
      {
        model: Categories(connectionOption),
      },
      {
        model: Images(connectionOption),
      },
    ],
    where: {},
    order: [["id", "DESC"]],
  };

  if (active) {
    filters.where["active"] = active === "true" ? true : false;
  }
  if (year) {
    filters.where["year"] = year;
  }
  if (id) {
    filters.where["id"] = id;
  }

  console.log(filters);
  return filters;
};

module.exports = { productFilters };
