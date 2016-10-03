'use strict';
//panel create item 
//lies on top of main list, fills up bottom 90% of screen
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
	Animated,
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
  
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
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
  	justifyContent: 'center',
  	flexDirection: 'row',
  },
  
  inventoryContainer:{
  	flexDirection: 'row',
  	padding: 20,
  	justifyContent: 'center'
  },
  header: {
  	justifyContent: 'center',
  },
  
  searchBar: {
  	height: 40,
  	backgroundColor: '#EBF4FA',
  	padding: 20,
  },
  blackBox:{
  	position: 'absolute',
  	backgroundColor: 'rgba(0,0,0,0.5)',
  	top: 0, left: 0,
  	width: deviceSize.width,
  	height: deviceSize.height,
  },
  panel: {
  	position: 'absolute',
  	
  	backgroundColor:'#FFFFFF',
  	width: deviceSize.width,
  	height: deviceSize.height
  },
  control:{
  	fontSize: 30,
  	padding:30,
  	color: '#656565'
  },
  buttons:{
  	marginLeft:30,
  	marginRight:30,
  	color: '#5CB3FF',
  }


})


 var CART_KEY = 'cartList';
class QuantityPanel extends Component {
	//constructor
	constructor(props){
	super(props);
	this.state={
		//extract data
		cartList: [],
		quantity : this.props.item.quantityOrdered,
		name: this.props.item.prod.product,
		price: this.props.item.prod.price,
		quant: this.props.item.prod.quantity,
		id: this.props.item.prod.id,
		fadeAnim: new Animated.Value(deviceSize.height),
		}
	}
  componentDidMount() {
    this._loadInitialState().done();
    Animated.timing(
    	this.state.fadeAnim,
    	{toValue: 0},
    	).start();
}

  async _loadInitialState() {
    try {
    var cartVal = await AsyncStorage.getItem(CART_KEY);
      if (cartVal !== null){
      	this.setState({cartList: JSON.parse(cartVal)});
        
        console.log('in cartList copy: ' + this.state.cartList);
        console.log('cartlist - Recovered selection from disk: ' + cartVal);
        console.log('name: ' +this.state.name)
        this.state.cartList.forEach(function(i){
        	console.log('forEach '+ i.prod.product)
        })
     } else {
        console.log('cartlist - Initialized with no selection on disk.');
      }

   	 } catch (error) {
      console.log('cartlist - AsyncStorage error: ' + error.message);
   	 
   	}
  }

	addQuantity(){
		//check if there are enough inventory items to order more
		if(this.state.quantity < this.state.quant){
		this.setState({ quantity: this.state.quantity + 1})
		}

		//else display out of stock
		
	}
	subtractQuantity(){
		if(this.state.quantity > 0) {
		this.setState({ quantity: this.state.quantity - 1})
		}
	}
	submitChange(){
		//update the cart list
		//hide the panel
		console.log("this.state.id"+ this.state.id);
		console.log("cartList"+ JSON.stringify(this.state.cartList))
		this.state.cartList.forEach(function(arrayItem){
			if(arrayItem.prod.id === this.state.id){
				//this is the item to update quantity on the list
				arrayItem.quantityOrdered = this.state.quantity
				console.log("quantity updated"+ arrayItem.quantityOrdered);
			}
		}.bind(this))
		AsyncStorage.setItem(CART_KEY, JSON.stringify(this.state.cartList));
		Animated.timing(
    	this.state.fadeAnim,
    	{toValue: deviceSize.height },
    	).start(() => this.props.hidePanel());

		
	}
cancelChange(){
	Animated.timing(
    	this.state.fadeAnim,
    	{toValue: deviceSize.height },
    	).start(() => this.props.hidePanel());
}



	render(){
		return(
			
		<View style={styles.blackBox}>
		<TouchableOpacity onPress={this.cancelChange.bind(this)}>
				<View style={{marginTop: 0, height: 300}}/>
			</TouchableOpacity>
		<Animated.View style={{marginTop: this.state.fadeAnim}}>
			<View style={styles.panel}>
				<View style={styles.headerContainer}>
					

					<TouchableOpacity onPress={this.cancelChange.bind(this)}>
					<Text style={styles.buttons} >close</Text>
					</TouchableOpacity>
					<Text style={styles.title}>QUANTITY</Text>
					<TouchableOpacity onPress={this.props.hidePanel}>
					<Text style={styles.buttons} onPress={this.submitChange.bind(this)}>save</Text>
					</TouchableOpacity>
				</View>

					<View style={styles.separator}/>
				
				
				
				<View style={styles.inventoryContainer}>
					<TouchableOpacity onPress={this.subtractQuantity.bind(this)}>
						<Text style={styles.control}>-</Text>
					</TouchableOpacity>

						<View>
					
						<Text style={styles.control}>{this.state.quantity}</Text>
						</View>

					<TouchableOpacity onPress={this.addQuantity.bind(this)}>
						<Text style={styles.control}>+</Text>
					</TouchableOpacity>
				</View>
			</View>
			
		</Animated.View>
		</View>
		
			);
	}
	
}

module.exports= QuantityPanel;