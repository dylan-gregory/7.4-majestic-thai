var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

var Food = Backbone.Model.extend({
  // idAttribute: '_id'
});

var FoodCollection = Backbone.Collection.extend({
  model: Food
});

// this will be for the items added into the cart
// could set up an Order model, which will allow duplicates on the server and give them a new cid for each order item
var OrderCollection = Backbone.Collection.extend({
  model: Food,
  localStorage: new Backbone.LocalStorage('cartedItems'),
  addTotal: function(){
    var cartItemPrices = this.map(function(item){
      return item.get('price');
    });

    var subtotal = cartItemPrices.reduce(function(memo, num){
      return memo + num;
    },0);
    // console.log(cartItemPrices);
    return subtotal.toFixed(2);
  }
});

// could just send the name and number of the items order to the kitchen -aka to tiny lasagna

var SentOrderCollection = Backbone.Collection.extend({
  model: Food,
  url: 'https://tiny-lasagna-server.herokuapp.com/collections/thaiorders'
});

module.exports = {
  Food,
  FoodCollection,
  OrderCollection,
  SentOrderCollection
};
