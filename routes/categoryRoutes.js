const express = require("express");
const {
  createCategoryController,
  categoryControlller,
  singleCategoryController,
  deleteCategoryCOntroller,
  updateCategoryController,
} = require("../controllers/categoryController");
const { reqiureSignIn, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

//routes
// create category
router.post(
  "/create-category",
  reqiureSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  reqiureSignIn,
  isAdmin,
  updateCategoryController
);

//getALl category
router.get("/get-category", categoryControlller);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  reqiureSignIn,
  isAdmin,
  deleteCategoryCOntroller
);

module.exports = router;
