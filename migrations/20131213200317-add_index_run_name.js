module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addIndex('runs',['name']);
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeIndex('runs',['name']);
    done()
  }
}
