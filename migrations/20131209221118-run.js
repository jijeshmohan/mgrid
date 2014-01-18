module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
      migration.createTable(
    'runs',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
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
    migration.dropTable('runs');
    done()
  }
}
