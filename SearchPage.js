'use strict';

var React = require('react');
var {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicatorIOS,
	Image,
	Component

} = React;

var SearchResults = require('./SearchResults');

var styles = StyleSheet.create({
	description: {
		marginBottom: 20,
		fontSize: 18,
		textAlign: 'center',
		color: '#656565'
	},
	container: {
		padding:30,
		marginTop: 65,
		alignItems: 'center'
	},
	flowRight: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'stretch'
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36, 
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom:  10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	searchInput: {
		height: 36,
		padding: 4,
		marginRight: 5,
		flex: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC'
	}

});

function urlForQueryAndPage(key, value, pageNumber) {
	var data = {
		productName: 'sweater',
		price: '23.00',
		quantity: '25'
	};
	data[key] = value;

	var querystring = Object.keys(data)
		.map(key => key + '=' + encodeURIComponent(data[key]))
		.join('&');

	return 'http://api.nestoria.co.uk/api?'  + querystring;
};

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchString: 'shoe',
			isLoading: false,
			message: ''
		};
	}

	onSearchTextChanged(event) {
		this.setState({ searchString: event.nativeEvent.text});	
	}

	_executeQuery(query) {
		console.log(query);
		this.setState({ isLoading:true });

		fetch(query)
			.then(function(response) {
				console.log('response:')
				console.log(response)
				return response.json()
			})
			.then(json => this._handleResponse(json.response))
			.catch(error =>
				this.setState({
					isLoading: false,
					message: 'Something bad happened ' + error
			}));

	}

	_handleResponse(response) {
		this.setState({ isLoading: false , message: '' });
		if (response.application_response_code.substr(0, 1)==='1') {
			console.log('Properties found: ' + response.listings.length );
		} else {
			this.setState({ message: 'Location not recognized; please try again.'});
		}
	}

	onSearchPressed(){
		var query = urlForQueryAndPage('item_name', this.state.searchString, 1);
		this._executeQuery(query);
	}

	render() {
		var spinner = this.state.isLoading ?
		( <ActivityIndicatorIOS
			hidden= 'true'
			size='large'/> ) :
		( <View/> );
		
		return (
			<View style={styles.container}>
				<Text style={styles.description}>
					Search for Products
				</Text>
				<Text style={styles.description}>
					Product name, price, quantity, add to cart
				</Text>
				<View style={styles.flowRight}>
					<TextInput
						style={styles.searchInput}
						value={this.state.searchString}
						onChange={this.onSearchTextChanged.bind(this)}
						placeholder = 'Search by name'/>
					<TouchableHighlight style={styles.button}
					onPress = {this.onSearchPressed.bind(this)}
						underlayColor='#99d9f4'>
						<Text style={styles.buttonText}>Go</Text>
					</TouchableHighlight>
				</View>
				<TouchableHighlight style={styles.button}
					underlayColor='#99d9f4'>
					<Text style={styles.buttonText}>Location</Text>
				</TouchableHighlight>
				{ spinner }
				<Text style={styles.description}>{this.state.message}</Text>
			</View>
		);
	}
}



module.exports = SearchPage;