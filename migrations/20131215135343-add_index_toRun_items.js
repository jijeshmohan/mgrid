module.exports = {
  up: function(migration, DataTypes, done) {
   	migration.addIndex('runitems',['runId']);
    migration.addIndex('runitems',['deviceId']);
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('runitems',['runId']);
    migration.removeIndex('runitems',['deviceId']);
    done()
  }
}
