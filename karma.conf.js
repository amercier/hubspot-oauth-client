/*jshint browser:false, node:true */

// Karma test runner configuration
// see http://karma-runner.github.io/0.12/config/configuration-file.html

module.exports = function(config) {
  "use strict";

  config.set({
    frameworks: [ "qunit", "sinon" ],
    files: [
      "src/hubspot-oauth-client.js",
      "tests/*.test.js"
    ],
    browsers: [ "PhantomJS" ],
    reporters: [ process.env.CI ? "dots" : "progress", "coverage" ],
    preprocessors: {
      "src/hubspot-oauth-client.js": [ "coverage" ]
    },
    coverageReporter: {
      dir: "tests/coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "lcovonly", subdir: ".", file: "report.lcov" },
        { type: "text", subdir: ".", file: "report.txt" },
        { type: "text-summary", subdir: ".", file: "summary.txt" }
      ]
    },
    customLaunchers: {
      "PhantomJS_debug": {
        base: "PhantomJS",
        options: {
          windowName: "Custom PhantomJS",
          settings: {
            webSecurityEnabled: false
          }
        },
        flags: [
          "--remote-debugger-port=9000",
          "--remote-debugger-autorun=yes"
        ]
      }
    }
  });
};
