const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add store' });
};

exports.createStore = async (req, res) => {
  // save to mongoose
  const store = new Store(req.body);
  await store.save();

  res.redirect('/');

};
