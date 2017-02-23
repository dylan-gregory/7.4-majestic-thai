var React = require('react');
var Backbone = require('backbone');

var FoodCollection = require('../models/models.js').FoodCollection;
var OrderCollection = require('../models/models.js').OrderCollection;

var MenuContainer = React.createClass({
  getInitialState: function(){
    var foodCollection = new FoodCollection();

    var orderCollection = new OrderCollection();

    return {
      foodCollection: foodCollection,
      orderCollection: orderCollection
    };
  },
  componentWillMount: function(){
    var newFoodCollection = this.state.foodCollection;

    newFoodCollection.add([
      {title: 'Spring Roll', price: 1.75, description: "Lovely, crispy, fried. You can't not eat 12", url: 'https://www.mmfoodmarket.com/images/default-source/default-album/chicken-spring-rolls.jpg?sfvrsn=0'},
      {title: 'Spicy Basil Fried Rice', price: 8.75, description: "Rice. That is fried. And spicy. What's not to love?", url: 'http://static.wixstatic.com/media/7dc740_fe3351c3a9f449ed87a59aeacc4f4137.jpg'},
      {title: 'Pad Thai', price: 7.75, description: "Noodley, shrimpy goodness", url: 'http://rasamalaysia.com/wp-content/uploads/2016/02/pad-thai-thumb.jpg'},
      {title: 'Red Curry', price: 9.25, description: "Creamy red curry sauce over chicken and rice", url: 'http://www.chichilicious.com/wp-content/uploads/Thai-red-curry-recipe.jpg'}
    ]);

    this.setState({foodCollection: newFoodCollection});

  },
  addToCart: function(food){
    console.log(food.get('price'));
    var newOrder = this.state.orderCollection;
    newOrder.add(food);

    this.setState({orderCollection: newOrder})

    console.log(newOrder);
    // food.get('price')
  },
  render: function(){

    return (
      <div className="wrapper">
        <div className="header">Majestic Thai</div>
          <div className="container">
            <div className="row">
            </div>
            <div className="row">
              <div className="col-md-8">

                <MenuList foodCollection={this.state.foodCollection}
                          addToCart={this.addToCart}
                />

              </div>
              <div className="col-md-4">
                <div className="cart-view">

                  <CartList
                    orderCollection={this.state.orderCollection}
                  />

                </div>
              </div>
            </div>
          </div>
        <div className="footer">
          Cool links, logos, yada yada yada...
        </div>
      </div>
    );
  }
});

var MenuList = React.createClass({
  render: function(){
    var self = this;
    var menuFoodView = this.props.foodCollection.map(function(food){
      return (
        <div key={food.cid}>
          <img className="food-img" src={food.get('url')} />
          <h3>{food.get('title')}</h3>
          <p>{food.get('description')}</p>
          <span>${food.get('price')}</span>
          <button onClick={function(event){
                event.preventDefault();
                self.props.addToCart(food);
              }}
              className="btn btn-primary">Add to cart</button>
        </div>
      )
    });

    return (
      <div className="menu-view">
        <h2>Menu List</h2>
        <ul>

          {menuFoodView}

        </ul>
      </div>
    );
  }
});

var CartList = React.createClass({
  getInitialState: function(){
    var cartItems = this.props.orderCollection;
    return {cartItems: cartItems};
console.log(this.props.orderCollection);
  },
  render: function(){
    var self = this;
    var cartItemList = this.props.orderCollection.map(function(cartItem){
      return (
        <div key={cartItem.cid}>
          <img className="food-img" src={cartItem.get('url')} />
          <h3>{cartItem.get('title')}</h3>
          <span>${cartItem.get('price')}</span>
        </div>
      );
    });

    return (
      <div className="well">
        <h2>Cart View</h2>
        <ul>
          {cartItemList}
        </ul>
        <OrderForm />
      </div>
    );
  }
});

var OrderForm = React.createClass({
  render: function(){
    return (
      <form>
        <input type="text" placeholder="Your Name" />
        <input type="text" placeholder="Your Phone Number" />


        <button className="btn btn-success">Place my order!</button>
      </form>
    );
  }
});

module.exports = {
  MenuContainer
};
