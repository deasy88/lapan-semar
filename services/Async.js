'use strict';

var Promise = require('bluebird');

// Wrap generator function to handle promises
// https://www.promisejs.org/generators/
exports.make = function(makeGenerator) {
    return function() {
        var generator = makeGenerator.apply(this, arguments);

        function handle(result) {
            // result => { done: [Boolean], value: [Object] }
            if (result.done) return Promise.resolve(result.value);

            return Promise.resolve(result.value).then(function(res) {
                return handle(generator.next(res));
            }, function(err) {

                return handle(generator.throw(err));
            });
        }

        try {
            return handle(generator.next());
        } catch (ex) {
            return Promise.reject(ex);
        }
    };
};

// Wrap express route
// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
exports.route = function(genFn) { // 1
    var cr = Promise.coroutine(genFn); // 2
    return function(req, res, next) { // 3
        cr(req, res, next).catch(next); // 4
    };
};
