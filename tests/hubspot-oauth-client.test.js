(function() {

  var validConfig = {
      clientId: "cc7ef1d9-d6a5-48c5-bfe8-c3f74f20633b",
      applicationId: 123456,
      applicationScope: [
        HubSpotOAuthClient.SCOPES.CONTACTS_READ_WRITE,
        HubSpotOAuthClient.SCOPES.EVENTS_READ_WRITE
      ]
    },
    client;

  function merge() {
    var merged = {},
        key,
        i;
    for (i = 0; i < arguments.length; i++) {
      for (key in arguments[ i ]) {
        if (arguments[ i ].hasOwnProperty(key)) {
          merged[ key ] = arguments[ i ][ key ];
        }
      }
    }
    return merged;
  }

  function exclude(config, keys) {
    var remaining = {},
        key;
    for (key in config) {
      if (config.hasOwnProperty(key)) {
        if (keys.indexOf(key) === -1) {
          remaining[ key ] = config[ key ];
        }
      }
    }
    return remaining;
  }

  QUnit.module("HubSpotOAuthClient");

  QUnit.test("Shouldn't throw an error while called with a valid config", function(assert) {
    assert.ok(new HubSpotOAuthClient(validConfig), "new HubSpotOAuthClient(valid config) passes");
  });

  QUnit.test("Should validate config.clientId", function(assert) {
    assert.expect(4);
    assert.throws(
      function() { new HubSpotOAuthClient(exclude(validConfig, [ "clientId" ])); },
      new Error("Missing parameter \"clientId\" from config"),
      "Missing config.clientId throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { clientId: "123-456" })); },
      new Error("Parameter \"clientId\" in config is invalid: \"123-456\""),
      "Invalid config.clientId (not a UUID) throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { clientId: "123456" })); },
      new Error("Parameter \"clientId\" in config is invalid: \"123456\""),
      "Invalid config.clientId (String) throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { clientId: NaN })); },
      new Error("Parameter \"clientId\" in config is invalid: \"NaN\""),
      "Invalid config.clientId (NaN) throws an error"
    );
  });

  QUnit.test("Should validate config.applicationId", function(assert) {
    assert.expect(3);
    assert.throws(
      function() { new HubSpotOAuthClient(exclude(validConfig, [ "applicationId" ])); },
      new Error("Missing parameter \"applicationId\" from config"),
      "Missing config.applicationId throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { applicationId: "123456" })); },
      new Error("Parameter \"applicationId\" in config is invalid: \"123456\""),
      "Invalid config.applicationId (String) throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { applicationId: NaN })); },
      new Error("Parameter \"applicationId\" in config is invalid: \"NaN\""),
      "Invalid config.applicationId (NaN) throws an error"
    );
  });

  QUnit.test("Should validate config.applicationScope", function(assert) {
    assert.expect(4);
    assert.throws(
      function() { new HubSpotOAuthClient(exclude(validConfig, [ "applicationScope" ])); },
      new Error("Missing parameter \"applicationScope\" from config"),
      "Missing config.applicationScope throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { applicationScope: "123456" })); },
      new Error("Parameter \"applicationScope\" in config is invalid: \"123456\""),
      "Invalid config.applicationScope (String) throws an error"
    );
    assert.throws(
      function() {
        new HubSpotOAuthClient(merge(validConfig, { applicationScope: [ "123456" ] }));
      },
      new Error("Parameter \"applicationScope\" in config is invalid: \"123456\""),
      "Invalid config.applicationScope (contains invalid value) throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { applicationScope: [] })); },
      new Error("Parameter \"applicationScope\" in config is invalid: \"\""),
      "Invalid config.applicationScope (empty array) throws an error"
    );
  });

  QUnit.test("Should validate config.windowWidth", function(assert) {
    assert.expect(2);
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { windowWidth: "123456" })); },
      new Error("Parameter \"windowWidth\" in config is invalid: \"123456\""),
      "Invalid config.windowWidth (String) throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { windowWidth: NaN })); },
      new Error("Parameter \"windowWidth\" in config is invalid: \"NaN\""),
      "Invalid config.windowWidth (NaN) throws an error"
    );
  });

  QUnit.test("Should validate config.windowHeight", function(assert) {
    assert.expect(2);
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { windowHeight: "123456" })); },
      new Error("Parameter \"windowHeight\" in config is invalid: \"123456\""),
      "Invalid config.windowHeight (String) throws an error"
    );
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { windowHeight: NaN })); },
      new Error("Parameter \"windowHeight\" in config is invalid: \"NaN\""),
      "Invalid config.windowHeight (NaN) throws an error"
    );
  });

  QUnit.test("Should validate config.windowTitle", function(assert) {
    assert.expect(1);
    assert.throws(
      function() { new HubSpotOAuthClient(merge(validConfig, { windowTitle: 123456 })); },
      new Error("Parameter \"windowTitle\" in config is invalid: \"123456\""),
      "Invalid config.windowTitle (number) throws an error"
    );
  });

  QUnit.test("Should set default parameters", function(assert) {
    assert.expect(3);
    var client = new HubSpotOAuthClient(validConfig);
    assert.strictEqual(
      client.config.windowTitle,
      HubSpotOAuthClient.DEFAULT_CONFIG.windowTitle,
      "windowTitle should be set to its default"
    );
    assert.strictEqual(
      client.config.windowWidth,
      HubSpotOAuthClient.DEFAULT_CONFIG.windowWidth,
      "windowWidth should be set to its default"
    );
    assert.strictEqual(
      client.config.windowHeight,
      HubSpotOAuthClient.DEFAULT_CONFIG.windowHeight,
      "windowHeight should be set to its default"
    );
  });

  QUnit.module("initiateOAuthIntegration", {
    beforeEach: function() {
      client = new HubSpotOAuthClient(validConfig);
    },
    afterEach: function() {
      client && client._window && client._window.close();
    }
  });

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

  QUnit.test("Should open a window", function(assert) {
    assert.expect(1);
    client.initiateOAuthIntegration();
    assert.notEqual(client._window, null, "Client window should not be null/undefined");
  });

  QUnit.test("Should return a thenable", function(assert) {
    assert.expect(3);
    var promise = client.initiateOAuthIntegration();
    assert.notEqual(promise, null, "Doesn't return null");
    assert.notEqual(promise.then, null, "<returned object>.then is not null");
    assert.strictEqual(typeof promise.then, "function", "<returned object>.then is a function");
  });

  QUnit.module("_oAuthIntegrationPromise", {
    beforeEach: function() {
      client = new HubSpotOAuthClient(validConfig);
    },
    afterEach: function() {
      client && client._window && client._window.close();
    }
  });

  QUnit.test("Should be rejected with \"canceled\" if the user close the window", function(assert) {
    assert.expect(2);
    var done = assert.async(),
        timeout = setTimeout(function() {
          assert.ok(false, "Promise should be rejected after 2000ms");
          done();
        }, 2000);

    client.initiateOAuthIntegration().then(
      function() {
        clearTimeout(timeout);
        assert.ok(false, "Promise should not be resolved");
        done();
      },
      function(error) {
        clearTimeout(timeout);
        assert.ok(true, "Promise not be rejected");
        assert.strictEqual(error, "canceled", "Promise has been rejected with \"canceled\" reason");
        done();
      }
    );

    client._window.close();
  });

  QUnit.module("oAuthCallback");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

})();
