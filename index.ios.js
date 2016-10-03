//to do
//animation - panel slides up
//clear inventory and cart on checkout
//pay option that does it

//pan gesture to delete
//if the row text is too long it has to wrap
//if inventory quantity is 0 or they ordered too much, say out of stock?
//when you make quantity changes and go back to parent, it doesn't save


'use strict';
var React = require('react');

var MyList = require('./listview');


var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component,
  NavigatorIOS, 
  AsyncStorage
} = React;


var styles = React.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});



class AwesomeProject extends React.Component {
  render() {
    return (
      <React.NavigatorIOS

        style={styles.container}
        navigationBarHidden={true}
        initialRoute={{
          title: 'All Products',
          component: MyList,

        }}/>
      );
  }
}

React.AppRegistry.registerComponent('AwesomeProject', function() { return AwesomeProject });
