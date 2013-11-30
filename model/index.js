module.exports = function(sequelize) {
    return {
        Device: sequelize.import(__dirname + '/device'),
    };
};
