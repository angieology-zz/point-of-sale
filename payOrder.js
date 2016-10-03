//pay
'use strict';
var React = require('react');



var {
	StyleSheet,
	Image,
	View,
	TouchableHighlight,
  TouchableOpacity,
	ListView,
	Text,
	TextInput,
	TouchableOpacity,
	Component,
	NavigatorIOS, 
	AsyncStorage,
	SwitchIOS
} = React;

var Dimensions = require('Dimensions')

var deviceSize = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,
}

var styles = StyleSheet.create({
  
  screenBox: {
  	flex: 1,
  	flexDirection: 'column',
  	justifyContent: 'center'
  },
  wholeView:{
  	height: deviceSize.height - 200,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  label:{
  	fontSize: 14,
  	color: '#ADA96E'
  },
  inputContainer: {
    flexDirection: 'column',
    padding: 20
  },

  headerContainer:{
  	padding: 20,
  	justifyContent: 'flex-end',
    	flexDirection: 'row',


  },
  header: {
  	flexDirection: 'row',
  	justifyContent: 'center',
    backgroundColor:'#EBF4FA',
    height: 60,

  },
  goBack:{
  	padding: 20,
  	color: '#656565',
  	justifyContent: 'flex-start',
  	marginRight: 240,

  },
   goPay: {
  	padding: 20,
  	color: '#656565',
  	justifyContent: 'flex-end',
  	marginLeft: 70
  },
  inventoryContainer:{
  	flexDirection: 'row',
  	justifyContent: 'center',
  	padding: 20
  },
  
  searchBar: {
  	height: 40,
  	backgroundColor: '#EBF4FA',
  	padding: 20,
  },
  totals:{
  	margin: 30,
  	padding:20,
  	justifyContent: 'flex-end',
  	fontSize: 28,
  	backgroundColor: '#EBF4FA',
  	fontWeight: 'bold',
  	marginBottom: 10,
  	color: '#656565'
  },
  textContainer: {
   
    flexDirection: 'row',
    justifyContent: 'center'
  },
  calc:{
  	fontSize: 14,
  	color: '#C3CCD2',
  },
  button:{
    
    borderRadius: 5,
    width: 200,
    backgroundColor: '#EBF4FA',
    padding: 20,
    margin: 40
  }
  

})
var Dimensions = require('Dimensions')

var deviceSize = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,

}
var CART_KEY='cartList'
var STORAGE_KEY = 'prodList'



class PayOrder extends Component {
	//constructor
	constructor(props){
	super(props);
	
	this.state={
		//state variables
		cartList: [],
		prodList: [],
    paySuccess: false,

		}
		
	}
	

	componentWillMount() {
    this._loadInitialState().done();

  }

  async _loadInitialState() {//get both lists from memory
    try {
      var prodVal = await AsyncStorage.getItem(STORAGE_KEY);
      if (prodVal !== null){
        this.setState({prodList: JSON.parse(prodVal)});
        
      
        console.log('in prodList copy: ' + this.state.prodList);
        console.log('prodlist - Recovered selection from disk: ' + prodVal);
      } else {
        console.log('prodlist - Initialized with no selection on disk.');
      }
    } catch (error) {
      console.log('prodlist - AsyncStorage error: ' + error.message);
    }

     try {
    var cartVal = await AsyncStorage.getItem(CART_KEY);
      if (cartVal !== null){
      	 this.setState({cartList: JSON.parse(cartVal)});
        
        console.log('in cartList copy: ' + this.state.cartList);
        console.log('cartlist - Recovered selection from disk: ' + cartVal);
     } else {
        console.log('cartlist - Initialized with no selection on disk.');
      }

   	 } catch (error) {
      console.log('cartlist - AsyncStorage error: ' + error.message);
   	 
   	}


   

  }



  //pop the route from navigator to return to page
	
	

_handlePress(){
  this.props.doRefresh2();
  this.props.navigator.pop();
}


 pay(){
 	//when you checkout, clear the cart, and subtract from product list.quantity (inventory)
 	//the same amount it was ordered
 	//pass down product list? can save changes to the async storage (like in creating item)
 	//product list is already in async storage for the session. parse the prodList
 	//for every item in the cart, find it in prodList, then delete inventory amount, 
 	//then delete item from the cart list
 	//have to save the cart to the session anyway because its not there when you go back
 	//should I change the quantity panel...
  console.log(JSON.stringify(this.state.cartList))
  this.state.cartList.forEach(function(cartItem){
   
    this.state.prodList.forEach(function(prodItem){
      
      if(cartItem.prod.product===prodItem.product){
      
        prodItem.quantity = prodItem.quantity - cartItem.quantityOrdered;
        
      }
    }.bind(this))
  }.bind(this))
 //remove all data in the cartList...
console.log(JSON.stringify(this.state.prodList));
  AsyncStorage.removeItem('cartList');
  AsyncStorage.setItem('prodList', JSON.stringify(this.state.prodList));
 

  
  this.setState({paySuccess: true});
  //this.props.doRefresh()
 }


	render(){
		return(
			<View>
			
	     <View style={styles.header}>
			<TouchableOpacity style={styles.goBack} onPress={this._handlePress.bind(this)}>
				<Text style={styles.title}>Back</Text>
			</TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={this.pay.bind(this)}>
        <Text style={styles.title}>Process Order</Text>
      </TouchableOpacity>

		  {this.state.paySuccess  ? <Text>Shopping cart cleared and inventory updated</Text> : 
        null}
		</View>
		
			);
	}
	
}

module.exports= PayOrder;