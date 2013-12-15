module.exports = {
  up: function(migration, DataTypes, done) {
  	migration.changeColumn(
	  	"runitems",
	  	"status",
	  	{
	       type:   DataTypes.ENUM,
	       values: ['Passed', 'Failed', 'Error', 'Running','Pending'],
	        allowNull: false,
	        default: 'Pending'
	  	}
  	);
    done()
  },
  down: function(migration, DataTypes, done) {
    done()
  }
}
