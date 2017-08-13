const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add store' });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();

  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

// exports.viewStore = (req, res) => {
//   res.render('viewStore', {
//     title: req.params.slug
//   });
// };
