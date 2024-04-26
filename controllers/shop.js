const Product = require('../models/product');
const Cart = require('../models/cart');
const { where } = require('sequelize');
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findAll({where:{id:prodId}})
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  
  req.user[0].getCart().then(cart=>{
    return cart.getProducts().then(products=>{
      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products
            });

    }).catch(err=>console.log(err))
    console.log(cart)
  }).catch(err=>console.log(err))
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;
  let newQuantity = 1;
  req.user[0].getCart().then(cart=>{
    fetchCart=cart
    return cart.getProducts({where:{id:prodId}})
    .then(products=>{
      let product
      if(products.length>0){
        product=products[0]

      }
      
      if(product){
        // ....... 
        const oldQuantity = product.cartitems.quantity
        newQuantity =oldQuantity+1;
        return product

        
      }
      return Product.findAll({where:{id:prodId}})
    }).then(product=>{
      return fetchCart.addProduct(product,{
        through:{quantity:newQuantity}
      })
    })
    .then(()=>{
      res.redirect('/cart')
    })
  }).catch(err=>console.log(err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user[0].getCart().then(cart =>{
    return cart.getProducts({where:{id:prodId}})

  }).then(products=>{
    const product = products[0];
     return product.cartitems.destroy({
      where:{
          id : prodId
      },
      raw:true
  })
  }).then(result =>{
    res.redirect('/cart')
  })
  .catch(err=>console.log(err))
  
};

exports.postOrder=((req,res,next)=>{
  let fetchCart
  req.user[0].getCart().then(cart=>{
    fetchCart = cart
return cart.getProducts()
  }).then(products=>{
    return req.user[0].createOrder().then(order=>{
      order.addProducts(products.map(product=>{
        product.orderItem = {quantity:product.cartitems.quantity}
        return product;

      })
    )
    })
    .catch(err=>console.log(err))
  }).then(result=>{
    fetchCart.setProducts(null)
   
  }).then(result=>{
    res.redirect('/orders')
  })
  .catch(err=>console.log(err))
})

exports.getOrders = (req, res, next) => {
  req.user[0].getOrders({include:['products']}).then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:orders
    });
  }).catch(err=>console.log(err))
  
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
