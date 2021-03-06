const React = require("react");

import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import injectTapEventPlugin from 'react-tap-event-plugin';

var $ = require("jquery");
var user = require("../models/user");
var selectedPad = require("../models/selectedPad");

var CommentInput = React.createClass({
	
	getInitialState: function() {
		return {
			content : ""
		};
	},

	setContent : function(e) {
		var content = this.refs.textInput.getValue();
		this.setState({
			content : content 
		});
	},

	canSave : function() {
		return this.state.content.length !== 0 &&
				user.id &&
				selectedPad.pad;
	},

	save : function() {

		if(!this.canSave()) {
			return;
		}

		var now = new Date();

		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();

		var created_time = `${month}/${date} ${hour}:${minute}`; 

		var data = {
			user_name : user.name,
			user_id : user.id,
			content : this.state.content,
			created_time : created_time
		};

		var pad_id = selectedPad.pad.pad_id;

		var url = `/pad/api/comment/${pad_id}/create`;
		var _this = this;
		$.post(url, data, function(res) {
			if(res == '200') {
				_this.setState({
					content : ""
				});
				_this.props.requestFresh();
			}
		}).error(function() {
			window.alert("服务器去开小差了，请稍后重试");
		});
	},

	render : function() {
		return (<div style={{padding: 20, paddingTop : 0, borderTop : "solid 1px #ccc"}}>
			<TextField ref="textInput" 
				multiLine={true} 
				floatingLabelText={"新的评语"}  
				hintText={"写下你的评语吧~"}
				value={this.state.content}
				onChange={this.setContent}
				style={{verticalAlign:"bottom"}}
			/>
			<FlatButton
		        label="发表"
		        primary={true}
		        keyboardFocused={true}
		        onTouchTap={this.save}
		        style={{verticalAlign:"bottom"}}
        	/>
		</div>);
	}
});

injectTapEventPlugin();

module.exports = CommentInput;