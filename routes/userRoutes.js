const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/resetPassword/:token', authController.resetPassword);

router.get(
  '/me',
  // authController.protect,
  userController.getMe,
  userController.getUser,
);

router.patch(
  '/updateMe',
  // authController.protect,
  userController.updateMe,
);

router.delete(
  '/deleteMe',
  // authController.protect,
  userController.deleteMe,
);

router.patch(
  '/updateMyPassword',
  // authController.protect,
  authController.updatePassword,
);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
