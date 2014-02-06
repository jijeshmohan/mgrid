module.exports = function(sequelize, DataTypes) {
  return sequelize.define('test',{
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
  },{
    classMethods: {
     
    },
    instanceMethods: {
     
    }
  });
};

