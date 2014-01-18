module.exports = {
  up: function(migration, DataTypes, done) {
     // add altering commands here, calling 'done' when finished
      migration.createTable(
    'runitems',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    }).complete(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('runitems');
    done()
  }
}