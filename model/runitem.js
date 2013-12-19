module.exports = function(sequelize, DataTypes) {
  return sequelize.define('runitem',{
    comments: {
       type: DataTypes.STRING(2000)
    },
    status: {
       type:   DataTypes.ENUM,
       values: ['Passed', 'Failed', 'Error', 'Running','Pending'],
       defaultValue: 'Pending'
    }
  },{
    classMethods: {
      
    },
    instanceMethods: {
    }
  });
};
