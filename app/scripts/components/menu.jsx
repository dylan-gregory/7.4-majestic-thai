var React = require('react');
var Backbone = require('backbone');
var _ = require ('underscore');

var FoodCollection = require('../models/models.js').FoodCollection;
var OrderCollection = require('../models/models.js').OrderCollection;
var Food = require('../models/models.js').Food;

var MenuContainer = React.createClass({
  getInitialState: function(){
    var foodCollection = new FoodCollection();
    console.log(localStorage.getItem('cartedItems'));

    var orderCollection = new OrderCollection();
    orderCollection.fetch();
    // var newSubTotal = this.state.orderCollection.addTotal();
    var total = orderCollection.addTotal();

    // var cartTotal = localStorage.getItem('cartedItems');

    return {
      foodCollection: foodCollection,
      orderCollection: orderCollection,
      subTotal: total
    };
  },
  componentWillMount: function(){

    var newFoodCollection = this.state.foodCollection;

    newFoodCollection.add([
      {title: 'Spring Roll', price: 1.49, description: "Lovely, crispy, fried. You can't not eat 12", url: 'https://www.mmfoodmarket.com/images/default-source/default-album/chicken-spring-rolls.jpg?sfvrsn=0'},
      {title: 'Spicy Basil Fried Rice', price: 8.99, description: "Rice. That is fried. And spicy. What's not to love?", url: 'http://static.wixstatic.com/media/7dc740_fe3351c3a9f449ed87a59aeacc4f4137.jpg'},
      {title: 'Pad Thai', price: 7.79, description: "Noodley, shrimpy goodness", url: 'http://rasamalaysia.com/wp-content/uploads/2016/02/pad-thai-thumb.jpg'},
      {title: 'Red Curry', price: 9.29, description: "Creamy red curry sauce over chicken and rice", url: 'http://www.chichilicious.com/wp-content/uploads/Thai-red-curry-recipe.jpg'}
    ]);

    this.setState({foodCollection: newFoodCollection,
                    });

  },
  componentDidMount: function(){
    // var newSubTotal = this.state.orderCollection.addTotal();
    // console.log(this.state.orderCollection);

  },
  addToCart: function(food){
    var newOrder = this.state.orderCollection;
    newOrder.create(food.toJSON());
    this.setState({orderCollection: newOrder})

    var newSubTotal = this.state.orderCollection.addTotal();

    this.setState({subTotal: newSubTotal});
    console.log(this.state.subTotal);
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
                    subTotal={this.state.subTotal}

                  />

                </div>
              </div>
            </div>
          </div>
        <div className="footer">
          Cool links to yelp, openTable, logos, yada yada yada...
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
    console.log('cart-items', this.props.orderCollection);
    return {cartItems: cartItems};

// console.log(this.props.orderCollection);
  },
  render: function(){
    var self = this;
    console.log(this.props.subTotal);
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
        <div>Subtotal:
          <span>${this.props.subTotal==0 ? "0.00" : this.props.subTotal}</span>
        </div>
        <OrderForm />
      </div>
    );
  }
});

var OrderForm = React.createClass({
  handleName: function(event){
    this.setState({name: event.target.value});
  },
  handleNumber: function(event){
    this.setState({number: event.target.value});
  },
  handleSubmit: function(event){
    event.preventDefault();


  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.handleName} placeholder="Your Name" />
        <input type="text" onChange={this.handleNumber} placeholder="Your Phone Number" />


        <button className="btn btn-success">Place my order!</button>
      </form>
    );
  }
});

module.exports = {
  MenuContainer
};
