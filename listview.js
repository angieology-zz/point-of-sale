'use strict';
var React = require('react');
var CreatePanel = require('./createPanel');
var Checkout = require('./checkoutCart');


var {
	StyleSheet,
	Image,
	View,
	TouchableHighlight,
	TouchableOpacity,
	ListView,
	Text,
	TextInput,
	Component,
	NavigatorIOS, 
	AsyncStorage,
} = React;

var Dimensions = require('Dimensions')

var deviceSize = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,

}
var styles = StyleSheet.create({
  
  textContainer: {
   	flex: 1, 
   	justifyContent: 'space-between',
    flexDirection: 'row',
    
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC',
   
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 20
  },
  screenBox: {
  	flex: 1,
  },
  searchBar: {
  	borderRadius: 10,
  	borderColor: '#EBF4FA',
  	borderWidth: 1,
  	height: 40,
  	backgroundColor: '#EBF4FA',
  	paddingLeft: 20,
  	paddingRight: 20,

  },
  plus: {
  	fontSize:35,
  	marginRight: 20,
  	marginLeft: 20,
  	color: '#656565',
  },
 
  menuGroup:{
  	
  	height: 60,
  	marginTop:20,
  	flexDirection: 'column',
  	backgroundColor: '#EBF4FA',


  },
  iconGroup: {
  	flexDirection: 'row',
  	alignItems: 'stretch',
  	margin: 10,
  	justifyContent: 'space-between',
  },
  iconButtons:{
  	flexDirection: 'row'
  },

  checkout:{
  	fontSize: 40,
  	justifyContent: 'flex-end'
  	
  },
  stockAlert:{
  	fontSize: 16,
  	 color: '#656565',
  	 justifyContent: 'flex-end',
  }





});
var CART_KEY = 'cartList';
var STORAGE_KEY= 'prodList';

class MyList extends Component {
	constructor(props){
		super(props);
		this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		
  this.state = {
    dataSource: this.ds.cloneWithRows([{ product: 'sweater', price:24.98, quantity :400, id:1},
    								{ product: 'suit and tie', price:340.22, quantity :400 ,id:2},
    								 { product: 'really nice sneakers', price:90.99, quantity :400, id:3},
    								{ product: 'shirt', price: 35.30, quantity: 200, id:4}]),
    //whether or not to show the search bar
    showSearchBar: false,
    searchKey: '',
    itemOpacity: 1.0,
    panelOn: false,
    //shopping cart isn't displayed in ListView so this is all you need
    //I think I want to calculate this separately here and in checkout
    cartList: [],
    keyList: 0,
    totalPrice: 0,
    count: 0,
    refreshKey: 0,
    
		}    

	}

componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {//get both lists from memory
    try {
      var prodVal = await AsyncStorage.getItem(STORAGE_KEY);
      if (prodVal !== null){
        this.setState({dataSource: this.ds.cloneWithRows(JSON.parse(prodVal))});
        //make a editable product list as well to access quantity,
        //when do you have to refresh the list?
        //make sure to add new items to this list
        
        this.setState({prodList : prodVal});
        //console.log('in prodList copy: ' + this.state.prodList);
       // console.log('prodlist - Recovered selection from disk: ' + prodVal);
      } else {
        console.log('prodlist - Initialized with no selection on disk.');
      }
    } catch (error) {
      console.log('prodlist - AsyncStorage error: ' + error.message);
    }

     try {
    var cartVal = await AsyncStorage.getItem(CART_KEY);
   
      if (cartVal !== null){
      	var recount = 0;
      	var reprice = 0;
        this.setState({cartList: JSON.parse(cartVal)});
        this.state.cartList.forEach(function(arrayItem){
        	recount += arrayItem.quantityOrdered;
        	reprice += (arrayItem.prod.price * arrayItem.quantityOrdered);
        })
        this.setState({totalPrice: Math.round(reprice*100)/100, count: recount});
        console.log('reprice: '+reprice + 'recount: ' + recount);
       
        console.log('cartlist - Recovered selection from disk: stringify' + 
        	cartVal);

     } else {
     	this.setState({cartList: [], totalPrice: 0, count: 0});
        console.log('cartlist - Initialized with no selection on disk.');
      }

   	 } catch (error) {
      console.log('cartlist - AsyncStorage error: ' + error.message);
   	 
   	}

   

  }

	toggleSearchBar () {
		this.setState({ showSearchBar: !this.state.showSearchBar })
	}

	showPanel() {
		this.setState({panelOn: true});
	}
	hidePanel(){
		this.setState({ panelOn: false });
	}


	debounce(text){
		this.setState({itemOpacity: 0.5, text: text});
		var timer = null;
		clearTimeout(timer);
		timer = setTimeout(function() {
			this.setState({itemOpacity: 1.0, searchKey: this.state.text });
			
		}.bind(this), 300)
	}

updateList(data){
	this.setState({dataSource: this.ds.cloneWithRows(data)})
}
//on checkout onPress, push route to checkout scene on navigator
//things needed from shopping cart...total items need to update and total price
//note the animations when adding items
_handlePress(){//also save current cart to asynch storage before proceeding

	AsyncStorage.setItem('cartList', JSON.stringify(this.state.cartList));
	this.props.navigator.push({component: Checkout, 
		passProps: { refreshKey: this.state.refreshKey,
			doRefresh: this.doRefresh.bind(this) }})
}




addToCart(item){
	//don't put item in cart if the quantity ordered is not less than quantity in inventory

			var alreadyOrdered = false;
			var orderSuccessful = false;
			this.state.cartList.forEach(function(cartItem){
		//check key
				if(cartItem.prod.id===item.id) {
					alreadyOrdered = true;
					if (cartItem.quantityOrdered < cartItem.prod.quantity) {
			
			//increase quantity ordered count
					cartItem.quantityOrdered ++;
					console.log(cartItem.prod.product + " ordered, " + cartItem.quantityOrdered );
					orderSuccessful = true;
				} else{
					//set message as out of stock
				}
				}
			})
	//item is not already in shopping cart, first check if selected item not out of stock
	// add with quantityOrdered set to 1
	//there has to be a case where item is already ordered and quantity ordered is greater than
	//quantity in invent
	//if item is not already there then it is safe to check only if item is not out of stock
			if(!alreadyOrdered && (item.quantity > 0)){

				var order = { prod: item, quantityOrdered: 1 };
				//don't set the quantity yet before checkout, but also don't allow
				//orders that are more than available...so check the quantity ordered with the inventory
				//quantity
				//if it hasn't been ordered yet, just make sure there is at least one in inventory
				//otherwise it will go to the first case, where it checks the shopping cart itself
				
				this.state.cartList.push(order);	
				orderSuccessful = true;

			}
			if (orderSuccessful){
			AsyncStorage.setItem('cartList', JSON.stringify(this.state.cartList));
			console.log('order successful and saved cartList' + JSON.stringify(this.state.cartList))
			this._loadInitialState()
			}
		
}

doRefresh(){
	this._loadInitialState()
	console.log("refreshed listview: " +this.state.refreshKey)

}





	render(){
	
		return(
			<View>

			<View style={styles.screenBox}>

			<View style={styles.menuGroup} key2={this.state.refreshKey}>
				<View style={styles.iconGroup}>
					<View style={styles.iconButtons}>
						<TouchableOpacity onPress={this.toggleSearchBar.bind(this)} >
						<Image source={require('./img/searchicon.png')} style={{width: 30, height: 30}}/>
						</TouchableOpacity>

						<TouchableOpacity onPress={this.showPanel.bind(this)}>
						<Text style={styles.plus}>＋</Text>
						</TouchableOpacity>
					</View>
					
					<TouchableOpacity onPress={this._handlePress.bind(this)}>
					<Text style={styles.checkout}>${this.state.totalPrice} > </Text>
					</TouchableOpacity>
				</View>
			</View>
			{ this.state.showSearchBar ? 
				<TextInput style={styles.searchBar}
				onChangeText={this.debounce.bind(this)} placeholder="search all products" /> : <Text/> }
			
			


			<ListView key={this.state.searchKey} key2={this.state.refreshKey} dataSource={this.state.dataSource} 
			style = {{opacity: this.state.itemOpacity, flex: 1, height: deviceSize.height-70}}
			renderRow={(rowData) => 
				{ if (rowData.product.toUpperCase().indexOf(this.state.searchKey.toUpperCase())!= -1 ){
					return (

				<View>
				<View style={ styles.rowContainer }>
				<TouchableOpacity onPress={function(){this.addToCart(rowData)}.bind(this)}>
					<View style={ styles.textContainer }>
						<Text style={ styles.title }> { rowData.product }</Text>
						<Text style={ styles.price }> ${ rowData.price }</Text>
						{ (rowData.quantity <= 0) ? <Text style={styles.stockAlert}> out of stock </Text> : null }
					</View>
				</TouchableOpacity>
				</View>
				<View style={styles.separator}/>
				</View>
			)} else
			{
				return null;
			}
				}
			}/>
			</View>
			{this.state.panelOn ? <CreatePanel  refreshKey={this.state.refreshKey}
			updateList = {this.updateList.bind(this)} 
			hidePanel={this.hidePanel.bind(this)}/>  : null}
			</View>
			
			);
	}
}


module.exports = MyList;

//checkout is easy?? from there