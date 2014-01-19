process.env.NODE_ENV = 'test'
var should = require('chai').should()
var sequelize = require('./init_seq');

var models = require('../model')(sequelize)

describe('Device', function() {
	 beforeEach(function(done){
        //clear out db
        models.Device.destroy().success(done).error(done);

         fakeDevice1 = {
            name            : 'Test device'
            , status    : 'disconnected'
            ,platform : 'ios'
            ,deviceType : 'mobile'
            ,osVersion : 1
        };
        fakeDevice2 = {
            name            : 'Test device2'
            , status    : 'available'
            ,platform : 'ios'
            ,deviceType : 'mobile'
            ,osVersion : 1
        };
       
    });


	 it('should have required properties', function(done){
	 		var device =  models.Device.build(fakeDevice1);
            device.save().success(function(){
                device.should.have.property('name', 'Test device');
                device.should.have.property('status', 'disconnected');
                done();
            }).error(function(error) {
			  done(error);
			});
     });
	 describe('class method',function(){
	 	beforeEach(function(done){
	 			models.Device.bulkCreate([fakeDevice1,fakeDevice2]).success(function(devices) { 
	 				done();
	 			}).error(done);
	 	});
	 	it('get all available devices',function(done){
	 		models.Device.availableDevices().success(function(devices){
	 			devices.length.should.equal(1);	
	 			devices[0].should.have.property('name', 'Test device2');
	 			done();
	 		}).error(done);
	 	});

	 	it('get all available devices count',function(done){
	 		models.Device.availableCount().success(function(count){
	 			count.should.equal(1);	
	 			done();
	 		}).error(done);
	 	});
	 });
	 describe('instance method',function(){
	     it('isAvailable',function(done){
	     	models.Device.bulkCreate([fakeDevice1,fakeDevice2]).success(function(devices) { 
	     		devices.length.should.equal(2);
	     		devices[0].isAvailable().should.be.false;
	     		devices[1].isAvailable().should.be.true;
	     		done();
	     	}).error(done);
	     });
	 });
});