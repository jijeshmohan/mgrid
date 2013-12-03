module.exports = function(sequelize, DataTypes) {
  return sequelize.define('device',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      status: {
         type:   DataTypes.ENUM,
         values: ['available', 'disconnected', 'disabled', 'running']
      },
      platform: {
         type:   DataTypes.ENUM,
         values: ['ios', 'android']
      },
      deviceType: {
         type:   DataTypes.ENUM,
         values: ['tablet', 'mobile']
      },
      osVersion: {
         type:   DataTypes.STRING
      }
  },{
    classMethods: {
      
    },
    instanceMethods: {
      isAvailable: function () {
        return this.status === 'available'
      },
      updateStatus: function (active) {
        if(active){
          this.status="available";
        }else{
          this.status="disconnected";
        }
        return this.save(['status'])
      }
    }
  });
};

