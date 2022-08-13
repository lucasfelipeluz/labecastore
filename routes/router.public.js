const router = require("express").Router();

const PublicController = require("../controllers/PublicControllers");

router.get("/products", PublicController.products);
router.get("/categories", PublicController.categories);
router.get("/products/categories/:id", PublicController.productsByCategoryId);

module.exports = router;
