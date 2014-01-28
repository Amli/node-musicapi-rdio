var assert = require('assert'),
    Rdio = require('./rdio');

var consumer_key = process.env.RDIO_CONSUMER_KEY,
    consumer_secret = process.env.RDIO_CONSUMER_SECRET;

describe('Rdio', function() {
    describe('constructor', function() {
        it("should fail if consumer_key and consumer_secret are missing", function() {
            assert.throws(
                function() {
                    new Rdio()
                }
            );
        });
        it('should not fail when consumer_key qnd consumer_secret qre provided', function() {
            assert.doesNotThrow(
                function() {
                    new Rdio({
                        consumer_key: consumer_key,
                        consumer_secret: consumer_secret
                    });
                }
            );
        });
    });
    describe('icon', function() {
        it('should return an url', function() {
            var rdio = new Rdio({
                consumer_key: consumer_key,
                consumer_secret: consumer_secret
            });
            assert(rdio.getServiceIconUrl());
        })
    })
    describe('query', function() {
        var rdio;
        before(function() {
            rdio = new Rdio({
                consumer_key: consumer_key,
                consumer_secret: consumer_secret
            });
        })
        describe("search artist", function() {
            it("should return a not empty an array of objects", function(done) {
                this.timeout(5000);
                rdio.search("artist", "Daft Punk", function(results) {
                    assert.notEqual(results.length, 0);
                    done();
                });
            });
        });

        describe("get albums for artist", function() {
            var results;
            before(function(done) {
                rdio.getArtistAlbums("r190508", function(r) {
                    results = r;
                    done();
                });
            });
            it("should return a not empty an array of objects", function() {
                assert.notEqual(results.length, 0);
            });
            it("should contain a title", function() {
                assert.ok("title" in results[0]);
            });
            it("should contain an href", function() {
                assert.ok("href" in results[0]);
            });
            it("should contain an id", function() {
                assert.ok("id" in results[0]);
            });
            it("should contain a cover", function() {
                assert.ok("cover" in results[0]);
            });
            it("should contain a release_date", function() {
                assert.ok("release_date" in results[0]);
            });
        });

        describe("get artist", function() {
            var result;
            before(function(done) {
                rdio.get("artist", "r190508", function(r) {
                    result = r;
                    done();
                });
            });
            it("should contain a name", function() {
                assert.ok("name" in result);
            });
            it("should contain an href", function() {
                assert.ok("href" in result);
            });
            it("should contain an id", function() {
                assert.ok("id" in result);
            });
            it("should contain an icon", function() {
                assert.ok("icon" in result);
            });
        });
    });
});
