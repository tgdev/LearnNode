const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// View
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));

// Create
router.get('/add', storeController.addStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

// Update
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

module.exports = router;
