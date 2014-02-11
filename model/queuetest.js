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
     
    },
    instanceMethods: {
     
    }
  });
};

