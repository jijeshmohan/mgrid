module.exports = {
  up: function(migration, DataTypes, done) {
    migration.removeColumn('runs', 'name').complete(done);
    done()
  },
  down: function(migration, DataTypes, done) {
    done()
  }
}
