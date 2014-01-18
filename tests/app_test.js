process.env.NODE_ENV = 'test'
var app = require(__dirname + '/../app.js').app;
var http = require('http');
var port = 3333
var should = require('chai').should()

describe('app', function() {
	var server = null;
		before(function(done) {
           server= app.listen(port, function(err, result) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            });

           });

            after(function(done) {
                server.close();
                done();
            });

            it('should exist', function(done) {
                should.exist(app);
                done();
            });

            it('should be listening at localhost:3333', function(done) {
                http.get("http://localhost:3333/", function(res) {
                    res.statusCode.should.eql(200);
                    done();
                });
 			 });

});