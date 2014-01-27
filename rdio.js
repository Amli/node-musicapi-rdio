var request = require('request'),
    baseurl = "http://api.rdio.com/1/",
    iconurl = "http://www.rdio.com/media/favicon_rdio_2012_11_15.ico",
    type_mapping = {
        artist: "Artist",
        album: "Album",
        track: "Track"
    };

var Rdio = function Rdio(options) {
    this.oauth = {
        consumer_secret: options.consumer_secret,
        consumer_key: options.consumer_key
    };
};

Rdio.prototype.getServiceIconUrl = function getServiceIconUrl() {
    return iconurl;
};


Rdio.prototype.search = function rdio_search(type, query, callback) {
    request.post(
        {
            url: baseurl,
            oauth: this.oauth,
            form: {
                method: "search",
                query: query,
                types: type_mapping[type]
            }
        },
        function(error, response, body) {
            var answer = JSON.parse(body),
                results = answer.result.results.map(function(item, key, list) {
                    return {
                        name: item.name,
                        id: item.key,
                        href: item.shortUrl,
                        icon: item.icon
                    };
                });
            callback(results, query);
        }
    );
}

Rdio.prototype.get = function rdio_get(type, id, callback) {
    request.post(
        {
            url: baseurl,
            oauth: this.oauth,
            form: {
                method: "get",
                keys: id
                // types: type_mapping[type]
            }
        },
        function(error, response, body) {
            var answer = JSON.parse(body),
                result = {
                    name: answer.result.name,
                    id: answer.result.key,
                    href: answer.result.shortUrl,
                    icon: answer.result.icon
                };
            callback(result, id);
        }
    );
}

Rdio.prototype.getArtistAlbums = function rdio_getArtistAlbums(artistid, callback) {
    request.post(
        {
            url: baseurl,
            oauth: this.oauth,
            form: {
                method: "getAlbumsForArtist",
                artist: artistid,
                extras: "releaseDateISO,streamRegions",
                sort: "releaseDate",
                count: 50
            }
        },
        function(error, response, body) {
            var answer = JSON.parse(body),
                availableAlbums = answer.result.map(function(item) {
                    return {
                        title: item.name,
                        id: item.key,
                        href: item.shortUrl
                    };
                });
            callback(availableAlbums, artistid);
        }
    );
};

module.exports = Rdio;
