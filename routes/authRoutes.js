const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  orderStatusController,
} = require("../controllers/authController");
const { reqiureSignIn, isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router(); //router object

//router
//Register || Method Post
router.post("/register", registerController);

//LOGIN ||POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//TEST route
router.get("/test", reqiureSignIn, isAdmin, testController);

//protected route user-auth
router.get("/user-auth", reqiureSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected route Admin-auth
router.get("/admin-auth", reqiureSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", reqiureSignIn, updateProfileController);

//order
router.get("/orders", reqiureSignIn, getOrderController);

//all order
router.get("/all-orders", reqiureSignIn, isAdmin, getAllOrderController);

//order status update
router.put(
  "/order-status/:orderId",
  reqiureSignIn,
  isAdmin,
  orderStatusController
);
module.exports = router;
