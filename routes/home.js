var _ = require('underscore')._;


exports.list = function(req, res){
	models.Run.findAll({order: 'createdAt DESC',include:[{model: models.RunItem,include: [{model: models.Scenario},{model: models.Device}]}]}).success(function(runs) {
		var r=generateRuns(runs.slice(0,5));
		var devices = _.uniq(_.flatten(_.map(r,function(rr){
			return _.keys(_.omit(rr,'name','id'));
		})));
		var status = getLastRunStatus(runs[0]);
		models.Device.availableCount().success(function(d){
		 res.render('home/index',{menu: 'dashboard',runs: r.reverse(),devices: devices , status: status, lastrun: runs[0], runcount: runs.length, deviceCount: d});
		});
	});
};

function getLastRunStatus(r){
	if(r === undefined){
		return [{}];
	}
	var status_count= _.countBy(_.flatten(_.map(r.runitems,function(item){
		return _.flatten(_.map(item.scenarios,function(s){
			return {status: s.status}
		}));
	})),function(i){
		return i.status;
	});

	return _.map(_.pairs(status_count),function(s){
		return {label: s[0],value: s[1]};
	});
}

function generateRuns(runs){
	return _.map(runs,function(r){
		var result ={};
		var device_info = _.map(r.runitems,function(runitem){
			return  [runitem.device.name, runitem.scenarios.length];
		});
		result.name = r.name();
		result.id=r.id;
		device_info.forEach(function(d){
			result[d[0]] = d[1];
		});
		return result;
	});
}