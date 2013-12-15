module.exports = function(sequelize) {
    var models = {
        Device: sequelize.import(__dirname + '/device'),
        Run: sequelize.import(__dirname + '/run'),
  		RunItem: sequelize.import(__dirname + '/runitem')
    };

    // Associations
	models.Run.hasMany(models.RunItem);
	models.Device.hasMany(models.RunItem);
	models.RunItem.belongsTo(models.Run);
	models.RunItem.belongsTo(models.Device);

    return models;
};
