module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable(
    'scenarios',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      runitemId: {
        type: DataTypes.INTEGER
      },
      feature: {
         type: DataTypes.STRING(2000)
      },
      status: {
         type:   DataTypes.ENUM,
         values: ['Passed', 'Failed', 'Skipped']
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
    migration.dropTable('scenario');
    done()
  }
}
