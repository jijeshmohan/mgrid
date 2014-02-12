module.exports = function(sequelize, DataTypes) {
  return sequelize.define('queuedevice',{
    deviceId: {
      type: DataTypes.INTEGER,
    },
    runId: {
      type: DataTypes.INTEGER,
    },
    status: {
      type:   DataTypes.ENUM,
      values: ['Waiting', 'Running'],
      defaultValue: 'Waiting'
    }
  },{
    classMethods: {
    
    },
    instanceMethods: {
     
    }
  });
};

