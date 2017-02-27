var $ = window.$ = window.jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Backbone = require('backbone');
var _ = require ('underscore');
require('bootstrap-sass');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

var FoodCollection = require('../models/models.js').FoodCollection;
var OrderCollection = require('../models/models.js').OrderCollection;
var Food = require('../models/models.js').Food;
var SentOrderCollection = require('../models/models.js').SentOrderCollection;



var MenuContainer = React.createClass({
  getInitialState: function(){
    var foodCollection = new FoodCollection();
    var sentOrderCollection = new SentOrderCollection();
    var orderCollection = new OrderCollection();
    console.log(orderCollection);
    orderCollection.fetch();

    if (localStorage.getItem('cartedItems') == null || localStorage.getItem('cartedItems').length == 0) {
      var total = 0;
    }else{
    var total = orderCollection.addTotal();
    }

    return {
      foodCollection: foodCollection,
      orderCollection: orderCollection,
      sentOrderCollection: sentOrderCollection,
      subTotal: total,
      showModal: false
    };
  },
  componentWillMount: function(){

    var newFoodCollection = this.state.foodCollection;

    newFoodCollection.add([
      {title: 'Spring Roll', price: 1.49, description: "Lovely, crispy, fried vegetable spring roll, served with sweet red chili dipping sauce. You can't not eat 12", url: 'https://www.mmfoodmarket.com/images/default-source/default-album/chicken-spring-rolls.jpg?sfvrsn=0'},
      {title: 'Spicy Basil Fried Rice', price: 8.99, description: "Rice. That is fried. And spicy. What's not to love? Served with your choice of chicken, shrimp, or beef", url: 'http://static.wixstatic.com/media/7dc740_fe3351c3a9f449ed87a59aeacc4f4137.jpg'},
      {title: 'Pad Thai', price: 7.79, description: "Our take on the classic street dish - made with housemade noodles, special sauce, peanuts, mixed vegetabes, and your choice of chicken or shrimp", url: 'http://rasamalaysia.com/wp-content/uploads/2016/02/pad-thai-thumb.jpg'},
      {title: 'Red Curry', price: 9.29, description: "Creamy red curry sauce over chicken, rice, and mixed vegetables", url: 'http://www.chichilicious.com/wp-content/uploads/Thai-red-curry-recipe.jpg'},
      {title: 'Yellow Curry', price: 9.49, description: "Like the Red curry...but yellow. Creamy yellow curry sauce over chicken, rice, and mixed vegetables", url: 'http://keeprecipes.com/sites/keeprecipes/files/yellow-chicken-curry.jpg'},
      {title: 'Tom Kha Gai', price: 8.79, description: "Coconut milk based soup, made with chicken, lemongrass, mushrooms, and chilies", url: 'http://assets.bonappetit.com/photos/57ae064653e63daf11a4e155/16:9/w_1000,c_limit/tom-kha-gai-chicken-coconut-soup.jpg'},
      {title: 'Orange Chicken', price: 7.79, description: "Crispy fried chicken smothered in our tangy orange sauce - served over rice and vegetables", url: 'https://i.ytimg.com/vi/W6OHCkpbdmo/maxresdefault.jpg'},
      {title: 'Thai Iced Tea', price: 2.29, description: "Sweet, spicy, and very refreshing", url: 'http://images.tastespotting.com/thumbnails/307173.jpg'}
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
    var orderToSend = this.state.sentOrderCollection;
    orderToSend.create(order);
    this.setState({sentOrderCollection: orderToSend});

    this.setState({orderCollection: new OrderCollection(), sentOrderCollection: new SentOrderCollection() , subTotal: 0});
    localStorage.clear();


  },
  openModal: function(){
    this.setState({showModal: true});

    var confirm = new ConfirmationModal();
    return this.setState({showModal: true});

  },
  closeModal: function(){

    return this.setState({showModal: false});
  },
  render: function(){


    return (
      <div className="wrapper">
        <div className="header">
          <img className="logo" src="https://www.shareicon.net/data/256x256/2016/09/07/827303_flower_512x512.png" />
          <span className="header-text">Majestic Thai</span>


        </div>
          <div id="container" className="container body" data-spy="scroll" data-target=".scrollspy">
            <div className="row">
            </div>
            <div className="row">
              <div className="col-md-8">

                <MenuList foodCollection={this.state.foodCollection}
                          addToCart={this.addToCart}
                />
              <ConfirmationModal openModal={this.state.showModal}
              closeModal={this.closeModal}
              />

              </div>
              <div className="col-md-4">
                <div className="cart-view">

                  <CartList
                    orderCollection={this.state.orderCollection}
                    subTotal={this.state.subTotal}
                    deleteFromOrder={this.deleteFromOrder}
                    sendOrder={this.sendOrder}
                    openModal={this.openModal}

                  />

                </div>
              </div>
            </div>
          </div>
        <div className="footer row">
          <div className="col-md-4 yelp-note"><div>How was your meal? Let us know on Yelp</div><a href="https://www.yelp.com/greenville"><i className="fa fa-yelp" aria-hidden="true"></i></a></div>
          <div className="col-md-4 social-notes"><div>Want to connect?</div>
          <a href="https://www.instagram.com/?hl=en"><i className="fa fa-instagram" aria-hidden="true"></i></a>
          <a href="https://www.facebook.com/"><i className="fa fa-facebook-square" aria-hidden="true"></i></a>
          <a href="https://twitter.com/?lang=en"><i className="fa fa-twitter-square" aria-hidden="true"></i></a></div>
          <div className="col-md-4 lemon"><div>(And here's a bonus little lemon)</div> <i className="fa fa-lemon-o" aria-hidden="true"></i></div>

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
    var cartItemList = this.props.orderCollection.map(function(cartItem){
      return (
        <div className="cart-item row" key={cartItem.cid}>
          <div className="col-md-9 cart-pic-name">
            <img className="cart-img" src={cartItem.get('url')} />
            <span className="cart-title">{cartItem.get('title')}</span>
          </div>
          <div className="price-box col-md-3">
            <span className="cart-price"> ${cartItem.get('price')}</span>
            <button onClick={function(event){
                event.preventDefault();
                self.props.deleteFromOrder(cartItem);
              }} type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>

            </div>
        </div>
      );
    });

    return (
      <div className="cart-orders well scrollspy">
        <h2>Your Order:</h2>
        <ul className="cart-list">
          {cartItemList}
        </ul>
        <div className="cart-subtotal well">Subtotal:
          <span className="subtotal-price">${this.props.subTotal==0 ? "0.00" : this.props.subTotal}</span>
        </div>
        <OrderForm  openModal={this.props.openModal} orderCollection={this.props.orderCollection}
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
  openModal: function(){
    this.props.openModal();
  },
  render: function(){

    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" className="form-control order-input" onChange={this.handleName} placeholder="Your Name" />
        <input type="text" className="form-control order-input" onChange={this.handleNumber} placeholder="Your Phone Number" />


        <button onClick={this.openModal} className="btn btn-success">Place my order!</button>
      </form>
    );
  }
});



var ConfirmationModal = React.createClass({
  getInitialState() {
    return {showModal: false};
  },
  componentWillReceiveProps: function(openModal) {
  this.setState({showModal: this.props.openModal});
  // this.setState({showModal: false});
  },
  close() {
    this.props.closeModal();
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },
  openModal() {
    //
    // this.props.openModal();
    // this.setState({showModal: this.props.openModal});

  },

  render() {

    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header className="thank-you" closeButton>
            <Modal.Title ><span className="thanks" >Thank you for your order!</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="food-ready"><i className="fa fa-cutlery" aria-hidden="true"></i>Your food will be ready in 15-20 minutes. See you soon!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-danger" onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});


module.exports = {
  MenuContainer
};
