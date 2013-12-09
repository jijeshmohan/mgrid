module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex('devices',['name']);
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('devices',['name']);
    done()
  }
}
