(function(QUnit) {
  'use strict';

  var validConfig = {
      clientId: 'cc7ef1d9-d6a5-48c5-bfe8-c3f74f20633b',
      applicationId: 123456,
      applicationScope: [
        HubSpotOAuthClient.SCOPES.CONTACTS_READ_WRITE,
        HubSpotOAuthClient.SCOPES.EVENTS_READ_WRITE
      ],
      redirectURI: './not-found.html'
    },
    client,
    getRelativeURL = function(relativeURL) {
      var base = document.querySelector('base');
      return base ? relativeURL.replace(/^\./, base.href) : relativeURL;
    };

  /**
   * Merge the contents of two or more objects together into the first object.
   *
   *     merge( target [, object1 ] [, objectN ] )
   *
   * @param {Object} target  An object that will receive the new properties if
   *                         additional objects are passed in.
   * @param {Object} object1 An object containing additional properties to merge in.
   * @param {Object} objectN An object containing additional properties to merge in.
   * @return {Object} Returns the first object.
   * @ignore
   */
  function extend() {
    var extended = arguments[0], key, i;
    for (i = 1; i < arguments.length; i++) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          extended[key] = arguments[i][key];
        }
      }
    }
    return extended;
  }

  function exclude(config, keys) {
    var remaining = {},
        key;
    for (key in config) {
      if (config.hasOwnProperty(key)) {
        if (keys.indexOf(key) === -1) {
          remaining[key] = config[key];
        }
      }
    }
    return remaining;
  }

  HubSpotOAuthClient.BASE_URL = getRelativeURL('./stubs/hubspot-login.html');

  QUnit.module('HubSpotOAuthClient');

  QUnit.test('Shouldn\'t throw an error while called with a valid config', function(assert) {
    assert.ok(new HubSpotOAuthClient(validConfig), 'new HubSpotOAuthClient(valid config) passes');
  });

  QUnit.test('Should validate config.clientId', function(assert) {
    assert.expect(4);
    assert.throws(
      function() { new HubSpotOAuthClient(exclude(validConfig, ['clientId'])); },
      new Error('Missing parameter "clientId" from config'),
      'Missing config.clientId throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { clientId: '123-456' })); },
      new Error('Parameter "clientId" in config is invalid: "123-456"'),
      'Invalid config.clientId (not a UUID) throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { clientId: '123456' })); },
      new Error('Parameter "clientId" in config is invalid: "123456"'),
      'Invalid config.clientId (String) throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { clientId: NaN })); },
      new Error('Parameter "clientId" in config is invalid: "NaN"'),
      'Invalid config.clientId (NaN) throws an error'
    );
  });

  QUnit.test('Should validate config.applicationId', function(assert) {
    assert.expect(3);
    assert.throws(
      function() { new HubSpotOAuthClient(exclude(validConfig, ['applicationId'])); },
      new Error('Missing parameter "applicationId" from config'),
      'Missing config.applicationId throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { applicationId: '123456' })); },
      new Error('Parameter "applicationId" in config is invalid: "123456"'),
      'Invalid config.applicationId (String) throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { applicationId: NaN })); },
      new Error('Parameter "applicationId" in config is invalid: "NaN"'),
      'Invalid config.applicationId (NaN) throws an error'
    );
  });

  QUnit.test('Should validate config.applicationScope', function(assert) {
    assert.expect(4);
    assert.throws(
      function() { new HubSpotOAuthClient(exclude(validConfig, ['applicationScope'])); },
      new Error('Missing parameter "applicationScope" from config'),
      'Missing config.applicationScope throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { applicationScope: '123456' })); },
      new Error('Parameter "applicationScope" in config is invalid: "123456"'),
      'Invalid config.applicationScope (String) throws an error'
    );
    assert.throws(
      function() {
        new HubSpotOAuthClient(extend({}, validConfig, { applicationScope: ['123456'] }));
      },
      new Error('Parameter "applicationScope" in config is invalid: "123456"'),
      'Invalid config.applicationScope (contains invalid value) throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { applicationScope: [] })); },
      new Error('Parameter "applicationScope" in config is invalid: ""'),
      'Invalid config.applicationScope (empty array) throws an error'
    );
  });

  QUnit.test('Should validate config.windowWidth', function(assert) {
    assert.expect(2);
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { windowWidth: '123456' })); },
      new Error('Parameter "windowWidth" in config is invalid: "123456"'),
      'Invalid config.windowWidth (String) throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { windowWidth: NaN })); },
      new Error('Parameter "windowWidth" in config is invalid: "NaN"'),
      'Invalid config.windowWidth (NaN) throws an error'
    );
  });

  QUnit.test('Should validate config.windowHeight', function(assert) {
    assert.expect(2);
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { windowHeight: '123456' })); },
      new Error('Parameter "windowHeight" in config is invalid: "123456"'),
      'Invalid config.windowHeight (String) throws an error'
    );
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { windowHeight: NaN })); },
      new Error('Parameter "windowHeight" in config is invalid: "NaN"'),
      'Invalid config.windowHeight (NaN) throws an error'
    );
  });

  QUnit.test('Should validate config.windowTitle', function(assert) {
    assert.expect(1);
    assert.throws(
      function() { new HubSpotOAuthClient(extend({}, validConfig, { windowTitle: 123456 })); },
      new Error('Parameter "windowTitle" in config is invalid: "123456"'),
      'Invalid config.windowTitle (number) throws an error'
    );
  });

  QUnit.test('Should set default parameters', function(assert) {
    assert.expect(3);
    var client = new HubSpotOAuthClient(validConfig);
    assert.strictEqual(
      client.config.windowTitle,
      HubSpotOAuthClient.DEFAULT_CONFIG.windowTitle,
      'windowTitle should be set to its default'
    );
    assert.strictEqual(
      client.config.windowWidth,
      HubSpotOAuthClient.DEFAULT_CONFIG.windowWidth,
      'windowWidth should be set to its default'
    );
    assert.strictEqual(
      client.config.windowHeight,
      HubSpotOAuthClient.DEFAULT_CONFIG.windowHeight,
      'windowHeight should be set to its default'
    );
  });

  QUnit.module('initiateIntegration', {
    beforeEach: function() {
      client = new HubSpotOAuthClient(validConfig);
    },
    afterEach: function() {
      if (client && client._promiseWindow && client._promiseWindow.isOpen()) {
        client._promiseWindow.close();
      }
      client = null;
    }
  });

  QUnit.test('Should fail when called with an invalid Hub ID', function(assert) {
    assert.expect(3);

    assert.throws(
      function() { client.initiateIntegration(); },
      new Error('Missing Hub ID'),
      'Should throw an error when Hub ID is not provided'
    );
    if (client._promiseWindow) {
      client._promiseWindow.close();
    }

    assert.throws(
      function() { client.initiateIntegration('not a number'); },
      new Error('Invalid HubSpot id "not a number"'),
      'Should throw an error when Hub ID is not a number'
    );
    if (client._promiseWindow) {
      client._promiseWindow.close();
    }

    assert.throws(
      function() { client.initiateIntegration(-123456); },
      new Error('Invalid HubSpot id "-123456"'),
      'Should throw an error when Hub ID is a negative number'
    );
  });

  QUnit.test('Should open a window', function(assert) {
    assert.expect(1);
    client.initiateIntegration(123456).then(function() {}, function() {});
    assert.notEqual(client._promiseWindow, null, 'Client window should not be null/undefined');
  });

  QUnit.test('Should return a thenable', function(assert) {
    assert.expect(3);
    var promise = client.initiateIntegration(12345).then(function() {}, function() {});
    assert.notEqual(promise, null, 'Doesn\'t return null');
    assert.notEqual(promise.then, null, '<returned object>.then is not null');
    assert.strictEqual(typeof promise.then, 'function', '<returned object>.then is a function');
  });

  QUnit.module('_oAuthIntegrationPromise', {
    beforeEach: function() {
      HubSpotOAuthClient.BASE_URL = getRelativeURL('./stubs/hubspot-login.html');
      client = new HubSpotOAuthClient(validConfig);
    },
    afterEach: function() {
      if (client && client._promiseWindow && client._promiseWindow.isOpen()) {
        client._promiseWindow.close();
      }
      client = null;
      HubSpotOAuthClient.BASE_URL = getRelativeURL('./stubs/hubspot-login.html');
    }
  });

  QUnit.test('Should be rejected with "closed" if the user close the window', function(assert) {
    assert.expect(2);
    var done = assert.async(),
        timeout = setTimeout(function() {
          assert.ok(false, 'Promise should not be pending before 5000ms');
          done();
        }, 5000);

    client.initiateIntegration(123456).then(
      function() {
        clearTimeout(timeout);
        assert.ok(false, 'Promise should not be resolved');
        done();
      },
      function(error) {
        clearTimeout(timeout);
        assert.ok(true, 'Promise should not be rejected');
        assert.strictEqual(error, 'closed', 'Promise has been rejected with "closed" reason');
        done();
      }
    );

    setTimeout(function() {
      client._promiseWindow.close();
    }, 0);
  });

  QUnit.module('redirectURI (success)', {
    beforeEach: function() {
      HubSpotOAuthClient.BASE_URL = getRelativeURL('./stubs/hubspot-success.html');
      client = new HubSpotOAuthClient(extend({}, validConfig, {
        redirectURI: './oauth-callback.html'
      }));
    },
    afterEach: function() {
      if (client && client._promiseWindow && client._promiseWindow.isOpen()) {
        client._promiseWindow.close();
      }
      client = null;
      HubSpotOAuthClient.BASE_URL = './hubspot-login.html';
    }
  });

  QUnit.test('Should redirect to the given URI', function(assert) {

    var hubId = 123456,
        done = assert.async(),
        timeout = setTimeout(function() {
          assert.ok(false, 'Callback should have been called before 5000ms');
          done();
        }, 5000);

    client.initiateIntegration(hubId).then(
      function(data) {
        clearTimeout(timeout);
        assert.ok(true, 'Promise should be resolved');
        assert.notEqual(data, undefined, 'Promise data should be passed to the callback');
        assert.strictEqual(data && data.hubId, hubId, 'Promise data should contain the Hub ID');
        done();
      },
      function(error) {
        clearTimeout(timeout);
        assert.ok(false, 'Promise should not be rejected (' + error + ')');
        done();
      }
    );
  });

})(window.QUnit);
