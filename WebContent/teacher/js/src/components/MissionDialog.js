import injectTapEventPlugin from 'react-tap-event-plugin';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import FlatButton from 'material-ui/lib/flat-button';

var React = require('react');
var {Base} = require("../data-station/index");

var selectedMission = require("./../models/selectedMission");
var selectedCourse = require("./../models/selectedCourse");
var missions = require("./../models/missions");
var dialogController = require("./../models/dialogController");

var MissionDialog = React.createClass({

	getInitialState: function() {
		return {
			name : "",
			start : null,
			end : null,
			content : "",
			desc : "" 
		};
	},

	componentDidMount: function() {
		this.ds = new Base();
		this.ds.addSource(dialogController, "DialogController.change");
		var _this = this;
		this.ds.addHandler(function() {
			if(dialogController.mission == "create" || !selectedMission.mission) {
				_this.state.name = "";
				_this.state.start = null;
				_this.state.end = null;
				_this.state.content = "";
				_this.state.desc = "";
			}
			else if(dialogController.mission == "update") {
				_this.state.name = selectedMission.mission.name;
				_this.state.start = new Date(Number(selectedMission.mission.start));
				_this.state.end = new Date(Number(selectedMission.mission.end));
				_this.state.content = selectedMission.mission.content || "";
				_this.state.desc = selectedMission.mission.desc || "";
			}
			_this.forceUpdate();
		}, "DialogController.change");
	},

	setName : function(e) {
		this.setState({
			name : this.refs.nameInput.getValue() 
		});
	},
	setDesc : function(e) {
		this.setState({
			desc : this.refs.descInput.getValue() 
		});
	},
	setStart : function(e, date) {
		this.setState({
			start : date 
		});
	},

	setEnd : function(e, date) {
		this.setState({
			end : date 
		});
	},
	setContent : function(e) {
		this.setState({
			content : this.refs.contentInput.getValue()
		});
	},
	save : function() {
		if(!selectedCourse.course) {
			return;
		}
		if(!this.state.name) {
			return;
		}
		if(!this.state.start || !this.state.end) {
			return;
		}
		if(this.state.end <= this.state.start) {
			return;
		}
		var _start = new Date(this.state.start);
		_start.setHours(0);
		_start.setMinutes(0);
		var _end = new Date(this.state.end);
		_end.setHours(0);
		_end.setMinutes(0);
		var mission = {
			name : this.state.name,
			start : _start.getTime(),
			end : _end.getTime(),
			content : this.state.content,
			desc : this.state.desc
		};
		if(dialogController.mission == "create") {
			missions.create(mission);
		}
		if(dialogController.mission == "update") {
			if(!selectedMission.mission) {
				return;
			}
			mission.id = selectedMission.mission.id;
			missions.update(mission);
		}
	},

	render: function() {
		
		const actions = [
			<FlatButton
	        	label="取消"
	        	secondary={true}
	        	onTouchTap={dialogController.hideAll.bind(dialogController)} />,
		  <FlatButton
		    label="确定"
		    primary={true}
		    keyboardFocused={true}
		    onTouchTap={this.save} />,
		];

	    var hide = dialogController.mission == "hide";

	    var title = "";

	    if(dialogController.mission == "create") {
	    	title = "添加";
	    }

	    if(dialogController.mission == "update") {
	    	title = "编辑";
	    }

	    title += "作业";

	    var now = new Date();

	    return (
	        <Dialog
	          title={title}
	          actions={actions}
	          modal={false}
	          open={!hide}
	          onRequestClose={dialogController.hideAll.bind(dialogController)}>
	          <div>
	          <div style={{display : "inline-block", verticalAlign : "top"}}>
	          <TextField floatingLabelText="请输入作业名称" 
	          			ref="nameInput" 
	          			hintText="" onChange={this.setName} value={this.state.name} /><br />
	          <TextField floatingLabelText="请输入作业简介" 
      		  			ref="descInput"
      		  			rowsMax={5}
	          			hintText="" onChange={this.setDesc} value={this.state.desc} 
	          			multiLine={true} />
	          <DatePicker
        		hintText="开始日期"
        		value={this.state.start}
        		onChange={this.setStart}
      		  />
	          <DatePicker
        		hintText="结束日期"
        		value={this.state.end}
        		onChange={this.setEnd}
      		  />
      		  </div>
      		  <div style={{display:"inline-block", verticalAlign : "top", marginLeft : 25}} >
      		  	<TextField floatingLabelText="请输入作业内容" 
      		  			ref="contentInput"
      		  			rowsMax={5}
	          			hintText="" onChange={this.setContent} value={this.state.content} 
	          			disabled={dialogController.mission == "update" && this.state.start > now}
	          			multiLine={true} />
      		  </div>
      		  </div>          
	        </Dialog>
   		);
		
	}
});

injectTapEventPlugin();

module.exports = MissionDialog;