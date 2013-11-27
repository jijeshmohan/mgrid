module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
     migration.createTable(
    'devices',
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
         values: ['available', 'disconnected', 'disabled', 'running']
      },
      platform: {
         type:   DataTypes.ENUM,
         values: ['ios', 'android']
      },
      deviceType: {
         type:   DataTypes.ENUM,
         values: ['tablet', 'mobile']
      },
      osVersion: {
         type:   DataTypes.STRING
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
    // migration.addIndex('devices',['name']);
    done()
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('devices');
    done()
  }
}
