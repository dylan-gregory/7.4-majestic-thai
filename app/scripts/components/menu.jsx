var React = require('react');
var Backbone = require('backbone');
var _ = require ('underscore');

var FoodCollection = require('../models/models.js').FoodCollection;
var OrderCollection = require('../models/models.js').OrderCollection;
var Food = require('../models/models.js').Food;
var SentOrderCollection = require('../models/models.js').SentOrderCollection;



var MenuContainer = React.createClass({
  getInitialState: function(){
    var foodCollection = new FoodCollection();
    // console.log(localStorage.getItem('cartedItems'));
    var sentOrderCollection = new SentOrderCollection();
    var orderCollection = new OrderCollection();
    console.log(orderCollection);
    orderCollection.fetch();
    // var newSubTotal = this.state.orderCollection.addTotal();
    if (localStorage.getItem('cartedItems') == null || localStorage.getItem('cartedItems').length == 0) {
      var total = 0;
    }else{
    var total = orderCollection.addTotal();
    }
    // var cartTotal = localStorage.getItem('cartedItems');

    return {
      foodCollection: foodCollection,
      orderCollection: orderCollection,
      sentOrderCollection: sentOrderCollection,
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
  deleteFromOrder: function(cartItem){

    var length = this.state.orderCollection.length;
    var updatedOrder = this.state.orderCollection;
    cartItem.destroy();
    this.setState({orderCollection: updatedOrder});

    var newSubTotal = this.state.orderCollection.addTotal();

    this.setState({subTotal: (this.state.orderCollection == null ? 0 : newSubTotal)});

  },
  addToCart: function(food){
    var newOrder = this.state.orderCollection;
    newOrder.create(food.toJSON());
    this.setState({orderCollection: newOrder})

    var newSubTotal = this.state.orderCollection.addTotal();

    this.setState({subTotal: newSubTotal});
  },
  sendOrder: function(order){
    console.log("new order", order);
    var orderToSend = this.state.sentOrderCollection;
    orderToSend.create(order);
    this.setState({sentOrderCollection: orderToSend});

    this.setState({orderCollection: new OrderCollection(), sentOrderCollection: '' , subTotal: 0});
    localStorage.clear();

  },
  render: function(){


    return (
      <div className="wrapper">
        <div className="header">
          <img className="logo" src="https://www.shareicon.net/data/256x256/2016/09/07/827303_flower_512x512.png" />
          <span className="header-text">Majestic Thai</span>


        </div>
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
                    deleteFromOrder={this.deleteFromOrder}
                    sendOrder={this.sendOrder}

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
        <div className="menu-parent" key={food.cid}>
          <h3><i className="fa fa-envira" aria-hidden="true"></i> <span className="food-title">{food.get('title')}</span></h3>
          <div className="menu-item" >
            <img className="food-img" src={food.get('url')} />
            <span className="food-description">{food.get('description')}</span>
            <div>
              <span className="food-price">${food.get('price')}</span>
              <button onClick={function(event){
                  event.preventDefault();
                  self.props.addToCart(food);
                }}
                className="btn btn-primary add-button">Add to cart</button>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="menu-view">
        <h2>Explore our menu:</h2>
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

// console.log(this.props.orderCollection);
  },
  // handleDelete: function(menuItem){
  //
  //   menuItem.destroy();
  // },
  render: function(){
    var self = this;
    console.log(this.props.subTotal);
    var cartItemList = this.props.orderCollection.map(function(cartItem){
      return (

        <div className="cart-item" key={cartItem.cid}>
          <img className="cart-img" src={cartItem.get('url')} />
          <span className="cart-title">{cartItem.get('title')}</span>
          <span className="cart-price">| ${cartItem.get('price')}</span>
          <button onClick={function(event){
              event.preventDefault();
              self.props.deleteFromOrder(cartItem);
            }} type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>

        </div>
      );
    });

    return (
      <div className="well">
        <h2>Your Order:</h2>
        <ul className="cart-list">
          {cartItemList}
        </ul>
        <div className="cart-subtotal well">Subtotal:
          <span className="subtotal-price">| ${this.props.subTotal==0 ? "0.00" : this.props.subTotal}</span>
        </div>
        <OrderForm orderCollection={this.props.orderCollection}
          sendOrder={this.props.sendOrder}/>
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

    this.setState({sentOrderCollection: localStorage.getItem('cartedItems')});

    this.props.sendOrder(this.state);

  },
  render: function(){

    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" className="form-control order-input" onChange={this.handleName} placeholder="Your Name" />
        <input type="text" className="form-control order-input" onChange={this.handleNumber} placeholder="Your Phone Number" />


        <button className="btn btn-success">Place my order!</button>
      </form>
    );
  }
});

module.exports = {
  MenuContainer
};
