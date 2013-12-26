module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scenario',{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comments: {
       type: DataTypes.STRING(2000)
    },
    status: {
       type:   DataTypes.ENUM,
       values: ['Passed', 'Failed', 'Skipped']
    },
    feature: {
         type: DataTypes.STRING(2000)
    },
  },{
      tableName: 'scenarios',
    classMethods: {
      
    },
    instanceMethods: {
    }
  });
};
