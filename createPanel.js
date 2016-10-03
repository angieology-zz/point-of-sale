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
	Component,
	NavigatorIOS, 
	AsyncStorage,
	Animated,
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
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 8.
  },

  headerContainer:{
  	padding: 20,
  	alignItems:'stretch',
  	flexDirection: 'row',

  },
    buttons:{
  	marginLeft:30,
  	marginRight:30
  },
  inventoryContainer:{
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	marginLeft: 20,
  	marginRight: 20,
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
  	justifyContent: 'flex-start',
  	
  	backgroundColor:'#FFFFFF',
  	width: deviceSize.width,
  	height: deviceSize.height
  }

})

var STORAGE_KEY = 'prodList';

class CreatePanel extends Component {
	//constructor
	constructor(props){
	super(props);
	this.state={
		//state variables
		productName: '',
		price: '',
		trackInventory: false,
		quantity: '',
		addEnabled: false,
		prodList: [],
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
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value != null){
        this.setState({prodList: JSON.parse(value)});
        console.log('Recovered selection from disk: ' + value);
      } else {
        console.log('Initialized with no selection on disk.');
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
	handleSubmit(){
		//add items to async storage json file
		// also leave panel

		//add all items as a object to list of objects in prodList
		this.state.prodList.push({product: this.state.productName, 
			price: this.state.price, 
			quantity: this.state.quantity,
			id: Math.floor(Math.random()*90000) });
		//stringify
		AsyncStorage.setItem('prodList', JSON.stringify(this.state.prodList));
		this.props.updateList(this.state.prodList);
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


	setProduct(text){
		this.setState({productName: text})
		if(this.state.price!='' && this.state.quantity!=''){
			this.setState({addEnabled: true})
		}
	}
	setPrice(text){
		//add price in left direction of the decimal
		
		this.setState({price: text})
		//if quantity and product name not null, enable save
		if(this.state.quantity!='' && this.state.productName!=""){
			this.setState({addEnabled: true});
		}

	}
	setQuantity(text){
		if(parseInt(text) > 0){
			this.setState({quantity: text})
			if((this.state.productName!='') && (this.state.price!='')){
			this.setState({addEnabled: true})
			}
		}
		
	}

	render(){
		return(
			
		<View style={styles.blackBox}>
			<TouchableOpacity onPress={this.cancelChange.bind(this)}>
				<View style={{marginTop: 0, height: 50}}/>
			</TouchableOpacity>

		<Animated.View style={{marginTop: this.state.fadeAnim}}>
			<View style={styles.panel}>
			<View style={{alignItems: 'center'}}>
				<View style={styles.headerContainer}>
				<TouchableOpacity onPress={this.cancelChange.bind(this)}>
					<Text style={[styles.buttons, {color: '#5CB3FF'}]}>close</Text>
				</TouchableOpacity>
				<Text style={styles.title}>Add a Product</Text>
				<TouchableOpacity onPress={this.state.addEnabled ? this.handleSubmit.bind(this) : null } >
					<Text style={[styles.buttons, this.state.addEnabled ? {color: '#5CB3FF'} : {color: '#B6B6B4'}]}>save</Text>
				</TouchableOpacity>
				

				<View style={styles.separator}/>
				</View>
			</View>

				<View style={styles.inputContainer}>
				<Text> PRODUCT </Text>
				<TextInput style={styles.searchBar} onChangeText={this.setProduct.bind(this)} autoFocus={true}/>
				<View style={styles.separator}/>
				</View>

				<View style={styles.inputContainer}>
				<Text> PRICE </Text>
				<TextInput style={styles.searchBar} onChangeText={this.setPrice.bind(this)} placeholder={'0.00'}/>
				<View style={styles.separator}/>
				</View>

			
				<View style={styles.inputContainer}>
				<Text> INVENTORY </Text>
				<TextInput style={styles.searchBar} onChangeText={this.setQuantity.bind(this)}
				placeholder={"0"} />
				<View style={styles.separator}/>
				</View>
			</View>
		</Animated.View>

		</View>
		
			);
	}
	
}

module.exports= CreatePanel;