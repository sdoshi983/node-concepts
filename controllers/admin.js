const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, price, description, imageUrl);

    product.save().then(result => {
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//     const editMode = req.query.edit;
//     if (!editMode) {
//         return res.render('/');
//     }

//     const prodId = req.params.productId;
//     req.user.getProducts({ where: { id: prodId } })     // getProduct method is created by sequelize because of association. Product belongs to user. Using this method, only the products with userId = user.Id will be returned
//         .then(products => {
//             if (!products) {
//                 return res.render('/');
//             }
//             res.render('admin/edit-product', {
//                 pageTitle: 'Edit Product',
//                 path: '/admin/edit-product',
//                 editing: editMode,
//                 product: products[0],
//             });
//         })
//         .catch(err => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const updatedImageUrl = req.body.imageUrl;
//     const updatedDescription = req.body.description;

//     Product.findByPk(prodId).then(product => {
//         product.title = updatedTitle;
//         product.price = updatedPrice;
//         product.imageUrl = updatedImageUrl;
//         product.description = updatedDescription;
//         return product.save();
//     }).then(result => {
//         console.log('UPDATED PRODUCT!');
//         res.redirect('/admin/products');
//     }).catch(err => {
//         console.log(err);
//     });
// };

// exports.getProducts = (req, res, next) => {
//     req.user.getProducts().then(products =>     // getProducts method is created by sequelize because of association. Only the products of the current user logged in will be returned
//         res.render('admin/products', {
//             prods: products,
//             pageTitle: 'Admin Products',
//             path: '/admin/products',
//         })
//     ).catch(err => console.log(err));

// };

// exports.postDeleteProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     Product.findByPk(prodId).then(product => {
//         return product.destroy();
//     }).then(result => {
//         console.log('DELETED PRODUCT!');
//         res.redirect('/admin/products');
//     }).catch(err => {
//         console.log(err)
//     });
// };