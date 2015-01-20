'use strict';

var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:query', controller.showMultiple); // idk naming conventions
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.put('/qty/:id', controller.updateQuantity);
router.patch('/:id', controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;