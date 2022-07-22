const router = require("express").Router();

const PublicController = require("../controllers/PublicControllers");

router.get("/products", PublicController.products);
router.get("/categories", PublicController.categories);

module.exports = router;
