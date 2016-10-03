//this includes the shopping cart
'use strict';
var React = require('react');


var {
	StyleSheet,
	Image,
	View,
	TouchableHighlight,
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
  	height: 60,

  },
  goBack:{
  	padding: 20,
  	color: '#656565',
  	justifyContent: 'flex-start',
  	marginRight: 70
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
   height: 70,
   padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  calc:{
  	fontSize: 14,
  	color: '#C3CCD2',
  },
  blackUnder:{
    position: 'relative',
    backgroundColor: '#656565',
    height:71
  },
  deleteX:{
    fontSize: 20,
     color: '#FFFFFF',
    padding:20,
  },
  mainRow:{
     position: 'absolute',
     top:0,
     width: deviceSize.width,
     backgroundColor: '#FFFFFF'
  }
  

})
var Dimensions = require('Dimensions')

var deviceSize = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height,

}
//method to keep track of touched row

class RowMove extends Component {
	//constructor
constructor(props){
	super(props);
	
	this.state={
    //
    slideAnim: new Animated.Value(0),
    isOpen: false
		
		}
  }

    //
    setOffset(offset){
      this.state.slideAnim.setValue(offset)
      
    }
    animateSlider(offset){
      //animate when let go 
      Animated.timing(
        this.state.slideAnim,
      {toValue: offset},
      ).start();
    }

    showState(){
      return this.state.isOpen
    }

    openFalse(){
      this.setState({isOpen: false})
    }
    openTrue(){
      this.setState({isOpen: true})
    }
		 
	render(){
		return(
      <View>
      <View style={styles.blackUnder}>
      <Text style={styles.deleteX} onPress={()=>this.props.deleteItem(this.props.rowData)}>
          delete
          </Text>
			 <Animated.View style={[styles.mainRow, {marginLeft: this.state.slideAnim}]}>
            <TouchableOpacity onPress={()=>this.props.showPanel(this.props.rowData)}  >
               <View style={ styles.textContainer }>
                 <Text style={ styles.title }> { this.props.rowData.prod.product }</Text>
                 <Text style={ styles.calc}> {this.props.rowData.quantityOrdered} x { this.props.rowData.prod.price } </Text>
                 <Text style={ styles.price }> ${ Math.round(this.props.rowData.prod.price * this.props.rowData.quantityOrdered * 100)/100}</Text>
                </View>
            </TouchableOpacity>
        <View style={styles.separator}/>
       </Animated.View>
        
         
        </View>
      </View>
		
			);
	}
	
}

module.exports= RowMove;