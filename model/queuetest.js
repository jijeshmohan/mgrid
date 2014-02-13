module.exports = function(sequelize, DataTypes) {
  return sequelize.define('queuetest',{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uri: {
       type:   DataTypes.STRING
    },
    feature: {
         type: DataTypes.STRING(2000)
    },
    status: {
      type:   DataTypes.ENUM,
      values: ['Pending', 'Running','Completed'],
      defaultValue: 'Pending'
    }
  },{
    classMethods: {
     pendingTests: function(){
      return this.findAll({ where: {status: 'Pending'} });
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

