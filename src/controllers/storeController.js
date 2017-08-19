const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const Store = mongoose.model('Store');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That file type is not allowed!' }, false);
    }
  }
};

// upload middleware (stores image in memory)
exports.upload = multer(multerOptions).single('photo');

// resize middleware (store modified image in file)
exports.resize = async (req, res, next) => {
  if (!req.file) return next();

  // create unique file name with ext based on mimetype
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  // continue
  next();
};

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.getStores = async (req, res) => {
  // query db for list of stores
  const stores = await Store.find();
  res.render('Stores', { title: 'Stores', stores });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add store' });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();

  req.flash('success', `Successfully created <strong>${store.name}</strong>. Care to leave a review?`);
  res.redirect(`/stores/${store.slug}`);
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // set the location data to be a Point
  req.body.location.type = 'Point';

  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return new store instead of old one
    runValidators: true
  }).exec();

  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  res.render('store', { title: store.name, store });
};

exports.getStoresByTag = async (req, res) => {
  const tags = await Store.getTagsList();
  if (!tags) return next();
  const tag = req.params.tag;
  res.render('tags', { title: tag || 'Tags', tags, tag });
};
