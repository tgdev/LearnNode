const mongoose = require('mongoose');
const Store = mongoose.model('Store');

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
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return new store instead of old one
    runValidators: true
  }).exec();

  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.viewStore = async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug });
  res.render('viewStore', { title: store.name, store });
};
