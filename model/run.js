var _ = require('underscore')._;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('run',{
      status: {
         type:   DataTypes.ENUM,
         values: ['Not Started', 'Completed', 'Running']
      },
      runType: {
         type:   DataTypes.ENUM,
         values: ['All', 'Distributed']
      },
      comments: {
        type: DataTypes.STRING(2000)
      }
  },{
    classMethods: {
      
    },
    instanceMethods: {
      name: function(){
        return "Run - " + this.id;
      },      
      dynamicStatus: function(){
        if(_.some(this.runitems, function(s){return s.status === 'Error'})){ 
          return 'Failed';
        }
        if(_.every(this.runitems, function(s){return s.status === 'Passed'})){ 
          return 'Passed';
        }
        if(_.every(this.runitems, function(s){return s.status === 'Running'})){ 
          return 'Running';
        }
        if(_.some(this.runitems, function(s){return s.status === 'Failed'})){ 
          return 'Failed';
        }
        return this.status;
      },
      scenariosStatusCount: function(){
        return _.map(this.runitems,function(item){
            return { device: item.device.name, deviceSatus: item.status, status: _.countBy(item.scenarios,function(s){ return s.status})};
        });
      },
      runTypeText: function () {
        if(this.runType === "All"){
          return "All Tests in each device"
        }else{
          return "Distribute Tests across all devices"
        }
      }
    }
  });
};

