var Backbone = require('backbone');

var Food = Backbone.Model.extend({

});

var FoodCollection = Backbone.Collection.extend({
  model: Food
});

// this will be for the items added into the cart
var OrderCollection = Backbone.Collection.extend({
  model: Food,
  addTotal: function(){
    var cartItemPrices = this.map(function(item){
      return item.price
    });

    var subtotal = cartItemPrices.reduce(function(memo, num){
      return memo + num;
    });
    return subtotal;
  }
});
//will call this wherever I need the subtotal to be show like this.props.orderCollection.subtotal()

module.exports = {
  Food,
  FoodCollection,
  OrderCollection
};
