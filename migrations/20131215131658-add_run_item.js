module.exports = {
  up: function(migration, DataTypes, done) {
     migration.createTable(
    'runitems',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      runId: {
        type: DataTypes.INTEGER
      },
      deviceId: {
         type: DataTypes.INTEGER
      },
      comments: {
         type: DataTypes.STRING(2000)
      },
      status: {
         type:   DataTypes.ENUM,
         values: ['Passed', 'Failed', 'Error', 'Running']
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('runitems');
    done()
  }
}