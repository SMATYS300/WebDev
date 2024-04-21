const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const { loggedIn } = require('../controllers/authController');

router.get('/', authController.getLoginPage);
router.post('/', authController.postLogin);
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);
router.get('/profile', loggedIn, homeController.getProfilePage);

router.get('/admin/profile', loggedIn, homeController.getAdminProfile);
router.get('/admin/database', loggedIn, homeController.getDatabasePage);
router.get('/admin/viewDatabase', loggedIn, homeController.getViewDatabasePage);
router.get('/admin/editUser/:id', loggedIn, homeController.getEditUserPage);
router.post('/admin/deleteUser/:id', loggedIn, homeController.postDeleteUser);
router.get('/admin/addUser', loggedIn, authController.getAddUserPage);
router.post('/admin/addUser', loggedIn, authController.postAddUser);

router.get('/pantry/profile', loggedIn, homeController.getPantryProfile);
router.get('/pantry/pantry', loggedIn, homeController.getPantryPage);

router.get('/user/profile', loggedIn, homeController.getUserProfile);
router.get('/user/produce', loggedIn, homeController.getProducePage);
router.get('/user/addItem', loggedIn, homeController.getAddItemPage);
router.post('/user/addItem', loggedIn, homeController.postAddItem);
router.get('/user/addedItems', loggedIn, homeController.getAddedItemsPage);

module.exports = router;