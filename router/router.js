const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const authorized = require("../middleware/middleware");


router.post('/userSignup', controller.userSignup);
router.post('/userLogin',  controller.userLogin);
router.get('/AlluserDetails', authorized, controller.AlluserDetails);
router.get('/getUserById/:id', authorized, controller.getUserById);
router.post('/logout', authorized, controller.userLogout);
router.put('/changePassword', authorized, controller.changePassword);

module.exports = router;