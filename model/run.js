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
      
    }
  });
};

