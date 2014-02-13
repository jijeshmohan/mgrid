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
      runningDevicesCount:function(){
        return this.count({ where: {status: 'Running'} });
      },
      availableDevices: function(){
        return this.findAll({ where: {status: 'Waiting'} });
      }
    },
    instanceMethods: {
      updateStatus: function (status) {
        this.status=status;
        return this.save(['status']);
      }
    }
  });
};

