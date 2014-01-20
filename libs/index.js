var _ = require('underscore')._;
var moment = require('moment');


module.exports = {generateStatusClass: function(status){ 
		switch(status.toLowerCase()){ 
			case 'failed':
			case 'error':
			return 'label-danger';
			break; 
			case 'passed': 
			return 'label-success';break; 
			case 'running':
			case 'skipped':
			return 'label-warning';
			break;
			case 'not started':
			return 'label-default';
			break;
		}
	},
	displayIcons: function(status){
		var stat="";
		switch(status.toLowerCase()){
			case 'passed':
				 stat="fa-check green";
				 break;
			case 'skipped':
				 stat="fa-circle-o yellow";
				 break;
			case 'failed':
			case 'error':
				 stat="fa-ban red";
				 break;
		}
		return "<i class=\"fa "+stat+"\"></i>"
	},
	groupScenarios: function(scenarios){
		return _.groupBy(scenarios,function(s){ return s.feature; });
	},
	formatDate: function(datetime){
		return moment(datetime).fromNow();
	} 
};