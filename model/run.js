var _ = require('underscore')._;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('run',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
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
      dynamicStatus: function(){
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
      runTypeText: function () {
        if(this.runType === "All"){
          return "All Tests in all devices"
        }else{
          return "Distribute tests in all devices"
        }
      }
    }
  });
};

