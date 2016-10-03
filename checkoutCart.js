//this includes the shopping cart
'use strict';
var React = require('react');
var QuantityPanel = require('./quantityPanel');
var PayOrder = require('./payOrder');
var RowMove = require('./rowMove');


var {
	StyleSheet,
	Image,
	View,
	TouchableHighlight,
	TouchableOpacity,
	ListView,
	Text,
	PanResponder,
	Animated,
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
  	justifyContent: 'space-between',
  	height: deviceSize.height,
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
  	justifyContent: 'space-between',
  	height: 60,
  	backgroundColor: '#EBF4FA',

  },
  goBack:{
  	padding: 20,
  	color: '#656565',
  	justifyContent: 'flex-start',
  	marginRight: 100
  },
   goPay: {
  	padding: 20,
  	color: '#656565',
  	justifyContent: 'flex-end',
  	
  },
  inventoryContainer:{
  	flexDirection: 'row',
  	justifyContent: 'center',
  
  },
  
  searchBar: {
  	height: 40,
  	backgroundColor: '#EBF4FA',
  	padding: 20,
  },
  totals:{
  	padding:20,
  	fontSize: 28,
  	fontWeight: 'bold',
  	color: '#656565',
  	
  },
  totalPanel:{
  	justifyContent: 'flex-end',
  	flexDirection: 'row',
  	backgroundColor: '#EBF4FA',
  	marginBottom: 0,
  },
  textContainer: {
   height: 70,
   padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  calc:{
  	fontSize: 14,
  	color: '#C3CCD2',
  }
  

})
var Dimensions = require('Dimensions')

var deviceSize = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,

}
var CART_KEY='cartList'

class Checkout extends Component {
	//constructor
constructor(props){
	super(props);
	this.cart = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	this.state={
		myrefs: {},
		//state variables
		//object for listview
		cartDataObj: this.cart.cloneWithRows([ {prod: { product: '', price:0, quantity :0},
											quantityOrdered: 0}]),
		//actual array...make sure two are always same
		//changed on...quantity change...but will both read from local stor
		//when you make a delete, delete from local stor and refresh
		cartList: [],
		totalPrice: 0,
		panelOn: false,
		item: null,
		keylist: 0,
		prodList: [],
		refreshKey2 : '',
		touchedID: 0,

		}
		 this.offset = 0
		this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => {
      	//keep from scrolling out
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => this.left = 0,
      onPanResponderMove: (evt, gestureState) => 
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        this.moveCenterView(gestureState.dx, gestureState.y0, gestureState.x0),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => this.moveFinished(gestureState.dx),
      onPanResponderTerminate: (evt, gestureState) => this.moveFinished(gestureState.dx),
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    })
		
	}

//left is absolute position, xoffset is relative move
 moveCenterView(xoffset,yabs,xabs) {
 	//move panel 
 	//must move only left or right, as much as finger moves
    //get id of the item being touched
    var index = Math.ceil(yabs/71) - 2;
    this.state.touchedID = this.state.cartList[index].prod.id;
    var cell = this.state.myrefs["cell"+this.state.touchedID]
    //if panel is already open
    if (cell.state.isOpen){//find another way to check if its open...
    	cell.setOffset(100 + xoffset)
    }else {
    	cell.setOffset(xoffset)
    }
    
        
  }
   moveFinished(left) {//when move finished
    //if left is more than 100, then snap to 100
    	var cell = this.state.myrefs["cell"+this.state.touchedID]
    if(left>=100){
    cell.animateSlider(100);
    cell.openTrue();
	} else{
    //else if move is less than 100 close the panel
    cell.animateSlider(0);
    cell.openFalse();
}
}


 componentWillMount() {
    this._loadInitialState().done();


  }

  async _loadInitialState() {//get cart from memory
    

     try{
    	var cartVal = await AsyncStorage.getItem(CART_KEY);
    	console.log("async storage **** cartval" + cartVal)
      	if (cartVal !== null){
      		//careful...two lists from same source
      		this.setState({cartDataObj: this.cart.cloneWithRows(JSON.parse(cartVal))});
      		this.setState({cartList: JSON.parse(cartVal)})
      		console.log('this.state.cartList'+ JSON.stringify(this.state.cartList))
      		var runningTot = 0;
      		this.state.cartList.forEach(function(arrayItem){
      			console.log("arrayItem.prod.price * arrayItem.quantityOrdered)" + arrayItem.prod.price * arrayItem.quantityOrdered)
				runningTot += arrayItem.prod.price * arrayItem.quantityOrdered
			}.bind(this))	
			runningTot = Math.round(runningTot * 100)/100
			this.setState({totalPrice: runningTot})
			
     	} 
     	else {
     		this.setState({cartDataObj: this.cart.cloneWithRows([]), totalPrice: 0});

     		console.log('keylist: '+this.state.keyList)
        console.log('cartlist - Initialized with no selection on disk.');

      	}

   	} catch (error) {
      	console.log('cartlist - AsyncStorage error: ' + error.message);
   	 
   	}
  }

  //pop the route from navigator to return to page
	
_handlePress(){
	this.props.doRefresh()
	this.props.navigator.pop();
}
_handlePay(){//also save current cart to asynch storage before proceeding
	AsyncStorage.setItem('cartList', JSON.stringify(this.state.cartList));
	this.props.navigator.push({component: PayOrder, 
		passProps: { doRefresh2: this.doRefresh2.bind(this) }});
}

showPanel(data) {

	//put rowData in the state to pass to panel
		this.setState({panelOn: true, item: data});
	}
hidePanel(){
		this.setState({ panelOn: false });
		this.doRefresh2();
	}
updateList(data){
	this.setState({dataSource: this.ds.cloneWithRows(data)})
}

doRefresh2(){
	
    	
	this.setState({refreshKey2: Math.random()});
	this._loadInitialState();
	console.log("refreshed checkout: " +this.state.refreshKey2)
}

deleteItem(item){
	

	//find item in list by id 

	var i;
	for(i=0; i<this.state.cartList.length; i++){
		if(this.state.cartList[i].prod.id==item.prod.id){
			this.state.cartList.splice(i,1)
		}
	}
	//save to async storage and reload the page...

	AsyncStorage.setItem('cartList', JSON.stringify(this.state.cartList));

	this.doRefresh2();
	var cell = this.state.myrefs["cell"+this.state.touchedID]
	cell.animateSlider(0);
	//error: after item is deleted, new item in position thinks it is old one
	//keeps delete panel open
}




	render(){
		return(
			<View>
			
		<View style={styles.screenBox}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.goBack} onPress={this._handlePress.bind(this)}>
				<Text style={styles.title}>Back</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.goPay} onPress={this._handlePay.bind(this)}>
					<Text style={styles.title}>Pay</Text>
				</TouchableOpacity>

			</View>

			<ListView ref="list" {...this._panResponder.panHandlers}  key={this.state.keylist}  dataSource={this.state.cartDataObj} style = {styles.wholeView}
			renderRow={(rowData) => 
				{return (
				<RowMove ref={(e) => this.state.myrefs["cell" + rowData.prod.id] = e} 
				rowData={rowData} 
				deleteItem={this.deleteItem.bind(this)} 
				showPanel={this.showPanel.bind(this)}>
				
				</RowMove>)
			
			}}/>
			
			<View style={styles.totalPanel}>
				<Text style={styles.totals} key2={this.props.refreshKey}> Total ${ this.state.totalPrice }</Text>
			</View>
		
			{this.state.panelOn ? <QuantityPanel item={this.state.item} 

			cartList={this.props.cartList} hidePanel={this.hidePanel.bind(this)}/>  : null}
			
		</View>
		</View>
		
			);
	}
	
}

module.exports= Checkout;