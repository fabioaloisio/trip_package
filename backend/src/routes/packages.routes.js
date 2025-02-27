const express = require('express');
const router = express.Router();
const packagesController = require('../controllers/packages.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', packagesController.getAllPackages);
router.get('/:id', authMiddleware, packagesController.getPackageById);

module.exports = router;
