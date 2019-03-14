// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const util = require('./js/util.js');
const Regexper = require('./js/regexper.js');
const Parser = require('./js/parser/javascript.js');
const _ = require('lodash');

(function () {
    // Global error handler that will send unhandled JavaScript exceptions and
    // stack-traces to Google Analytics. This data can be used to find errors in
    // code that were not found during testing.
    window.addEventListener('error', function (error) {
        if (error.lineno !== 0) {
            util.track('send', 'event', 'global', 'exception',
                `${error.filename}(${error.lineno},${error.colno}): ${error.message}`);

            if (typeof error.error !== 'undefined' && typeof error.error.stack !== 'undefined') {
                util.track('send', 'event', 'global', 'stack trace', error.error.stack);
            }
        }
    });

    // Initialize the main page of the site. Functionality is kept in the
    // [Regexper class](./regexper.html).
    if (document.body.querySelector('#search')) {
        let regexper = new Regexper(document.body);

        regexper.detectBuggyHash();
        regexper.bindListeners();

        util.tick().then(() => {
            window.dispatchEvent(util.customEvent('hashchange'));
        });
    }

    // Initialize other pages on the site (specifically the documentation page).
    // Any element with a `data-expr` attribute will contain a rendering of the
    // provided regular expression.
    _.each(document.querySelectorAll('[data-expr]'), element => {
        new Parser(element, {keepContent: true})
            .parse(element.getAttribute('data-expr'))
            .then(parser => {
                parser.render();
            })
            .catch(util.exposeError);
    });
}());