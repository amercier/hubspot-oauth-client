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
    browsers: process.env.CI ? [ "PhantomJS" ] : [ "Chrome", "PhantomJS_debug" ],
    reporters: process.env.CI ? [ "dots", "coverage" ] : [ "progress" ],
    preprocessors: !process.env.CI ? {} : {
      "src/hubspot-oauth-client.js": [ "coverage" ]
    },
    coverageReporter: !process.env.CI ? {} : {
      dir: "tests/coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "lcovonly", subdir: ".", file: "report.lcov" },
        { type: "text", subdir: ".", file: "report.txt" },
        { type: "text-summary", subdir: ".", file: "summary.txt" }
      ]
    },
    customLaunchers: process.env.CI ? {} : {
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
          "--remote-debugger-autorun=yes",
          "--debug=true"
        ]
      }
    },
    singleRun: !!process.env.CI,
    autoWatch: !process.env.CI
  });
};
