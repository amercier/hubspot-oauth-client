(function() {

  var validConfig = {
    clientId: "cc7ef1d9-d6a5-48c5-bfe8-c3f74f20633b",
    applicationId: 123456,
    applicationScope: [
      HubSpotOAuthClient.SCOPES.CONTACTS_READ_WRITE,
      HubSpotOAuthClient.SCOPES.EVENTS_READ_WRITE
    ]
  };

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

  QUnit.test("HubSpotOAuthClient with valid config doesn't throw an error", function(assert) {
    assert.ok(new HubSpotOAuthClient(validConfig), "new HubSpotOAuthClient(valid config) passes");
  });

  QUnit.test("HubSpotOAuthClient validates config.clientId", function(assert) {
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

  QUnit.test("HubSpotOAuthClient validates config.applicationId", function(assert) {
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

  QUnit.test("HubSpotOAuthClient validates config.applicationScope", function(assert) {
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

  QUnit.test("HubSpotOAuthClient validates config.windowWidth", function(assert) {
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

  QUnit.test("HubSpotOAuthClient validates config.windowHeight", function(assert) {
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

  QUnit.module("_hasPendingOAuthIntegration");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

  QUnit.module("_setHubId");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

  QUnit.module("oAuthCallback");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

  QUnit.module("_getOAuthURL");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

  QUnit.module("_getWindowTitle");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

  QUnit.module("_getWindowConfig");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

  QUnit.module("initiateOAuthIntegration");

  QUnit.test("NOT IMPLEMENTED", function(assert) {
    assert.expect(0);
  });

})();
