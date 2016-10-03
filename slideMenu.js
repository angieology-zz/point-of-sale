'use strict';

var React = require('react-native');
var {
	Animation,
	PanResponder,
	StyleSheet,
	View,
} = React

var Dimensions = require('Dimensions')
var screenWidth = Dimensions.get('window').width

var styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	center: {
		flex: 1,
		backgroundColor: '#FFFFFF',

	},
	left:{
		position:'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: '#FFFFFF',
	},
})

class SlideMenu extends Component {
	componentWillMount(){
	this.offset = 0
	this._panGesture = PanResponder.create({
		onMoveShouldSetPanResponder: (evt, gestureState)=> {
			return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
			&& Math.abs(gestureState.dx) > 10
			},
		onPanResponderGrant: (evt, gestureState) => this.left=0,
		onPanResponderMove: (evt, gestureState) -> this.moveCenterView(gestureState.dx),
		onPanResponderRelease: this.moveFinished,
		onPanResponderTerminate: this.moveFinished,
		})
	}

	moveCenterView(left){
		if(!this.center) return

		if((this.offset + left) < 0){
			this.left = -this.offset
		} else {
			this.left = left
		}

		this.center.setNativeProps({let: this.offset + this.left})
	}

	moveFinished(){
		if(!this.center) return
			var offset = this.offset + this.left
		if(this.offset === 0){
			if(offset > screenWidth * 0.25){
				this.offset = screenWidth * 0.75
			}
		}
		Animation.startAnimation(this.center, 400, 0, 'easeInOut',
		 {'anchorPoint.x':0, 'position.x': this.offset})
		this.center.setNativeProps({left: this.offset})
	}

render(){
	var centerView = this.props.renderCenterView ? this.props.renderCenterView() : null
	var leftView = this.props.renderLeftView ? this.props.renderLeftView() : null


	return (
		<View style={[styles.container, this.props.style]}>
			<View style={styles.left}>
				{leftView}
			</View>
			<View
				style={[styles.center, {left: this.offset}]}
				ref={(center) => this.center = center}
				{...this._panGesture.panHandlers}>
				{centerView}
			</View>
		</View>
		)
	}

}

module.exports = SlideMenu