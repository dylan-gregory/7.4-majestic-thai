var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

var Food = Backbone.Model.extend({
  // idAttribute: '_id'
});

var FoodCollection = Backbone.Collection.extend({
  model: Food
});

// this will be for the items added into the cart
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


//will call this wherever I need the subtotal to be show like this.props.orderCollection.subtotal()

module.exports = {
  Food,
  FoodCollection,
  OrderCollection
};
