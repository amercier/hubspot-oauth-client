/**
 * HubSpot OAuth Client
 *
 * A JavaScript SDK for the HubSpot API that is used to facilitate OAuth authentication with
 * HubSpot.
 *
 * https://github.com/amercier/hubspot-oauth-client
 * @ignore
 */
(function() {
  'use strict';

  var root = window,
      prototype,
      validScopes;

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

  /**
   * Get the type of the object
   *
   * @param  {[type]} object Object
   * @return {String} Returns the object type
   */
  function getType(object) {
    return Object.prototype.toString.apply(object);
  }

  /**
   * Check whether an object is a number or not
   *
   * @param  {Any}  number The object to check
   * @return {Boolean} Returns `true` if `number` is a valid number (not NaN), `false` otherwise
   */
  function isValidNumber(number) {
    return typeof number === 'number' && !isNaN(number);
  }

  function isValidURI(uri) {
    return typeof uri === 'string';
  }

  function fixedEncodeURIComponent(str) {
    return root.encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  /**
   * Create a new HubSpot Client
   *
   * @param {Object} config Configuration
   * @param {config} config.clientId [description]
   * @constructor
   */
  function HubSpotOAuthClient(config) {

    this.config = extend({}, this.constructor.DEFAULT_CONFIG, config);
    this.constructor.validateConfiguration(this.config);
    this.callbacks = {
      oAuthSuccess: [],
      oAuthError: []
    };
  }

  /**
   * Regular expression for UUID
   * @type {RegExp}
   */
  HubSpotOAuthClient.UUID_REGEXP = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

  /**
   * Application scopes
   * http://developers.hubspot.com/docs/methods/auth/initiate-oauth
   *
   * @type {Object}
   * @namespace
   */
  HubSpotOAuthClient.SCOPES = {};

  /**
   * Offline Access scope
   *
   * This application can make API requests on behalf of the user when the user is offline (not
   * actively using the app). You will receive a refresh token when the user authenticates that you
   * can store to gain access to a new, valid access token programtically using the refresh token
   * method.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.OFFLINE = 'offline';

  /**
   * Contacts Read/Write scope
   *
   * This application reads your contact information, as well as creates new contacts, contact
   * lists, and contact properties. It can also modify existing contacts, properties, and contact
   * lists.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.CONTACTS_READ_ONLY = 'contacts-ro';

  /**
   * Contacts Read-Only scope
   *
   * This application can read your contact information, as well as information about your contact
   * properties and contact lists.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.CONTACTS_READ_WRITE = 'contacts-rw';

  /**
   * Blog Read/Write
   *
   * This application can read your blog data, including posts and comments, as well as create new
   * blog posts and comments.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.BLOG_READ_WRITE = 'blog-rw';

  /**
   * Events Read/Write
   *
   * This application can read your marketing events, as well as post new ones into your HubSpot
   * account.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.EVENTS_READ_WRITE = 'events-rw';

  /**
   * Keywords Read/Write
   *
   * This application can read your keyword data, as well as insert new ones into your HubSpot
   * account.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.KEYWORD_READ_WRITE = 'keyword-rw';

  /**
   * All application scopes
   * @type {Array}
   */
  validScopes = [
    HubSpotOAuthClient.SCOPES.OFFLINE,
    HubSpotOAuthClient.SCOPES.CONTACTS_READ_ONLY,
    HubSpotOAuthClient.SCOPES.CONTACTS_READ_WRITE,
    HubSpotOAuthClient.SCOPES.BLOG_READ_WRITE,
    HubSpotOAuthClient.SCOPES.EVENTS_READ_WRITE,
    HubSpotOAuthClient.SCOPES.KEYWORD_READ_WRITE
  ];

  /**
   * Default configuration
   *
   * @type {Object}
   */
  HubSpotOAuthClient.DEFAULT_CONFIG = {
    integrationURI: 'https://app.hubspot.com/auth/authenticate',
    windowWidth: 600,
    windowHeight: 400,
    cancelCheckDelay: 100
  };

  /**
   * Configuration parameters validator functions.
   * - each key represents a key of the config object
   * - each value is a validator function:
   *   - accepting a `value` parameter
   *   - returning `true` if the given value is valid, `false` otherwise
   *
   * @type {Object}
   */
  HubSpotOAuthClient.CONFIG_VALIDATORS = {
    integrationURI: isValidURI,
    clientId: function validate(id) { return HubSpotOAuthClient.UUID_REGEXP.test(id); },
    applicationScope: function validate(scope) {
      return getType(scope) === '[object Array]' && scope.length > 0 &&
        scope.every(function filterScopeItem(scopeItem) {
          return validScopes.indexOf(scopeItem) !== -1;
        });
    },
    redirectURI: isValidURI,
    windowHeight: function validate(height) { return isValidNumber(height); },
    windowWidth: function validate(width) { return isValidNumber(width); },
    cancelCheckDelay: function validate(delay) { return isValidNumber(delay); }
  };

  /**
   * Validate given configuration settings
   *
   * Each key/value of the given configuration object will be validated against
   * `HubSpotOAuthClient.CONFIG_VALIDATORS`.
   *
   * @throws Error Throw an `Error` if at least one of the condition is met:
   * - one key is unknown (being in `config` but not in `CONFIG_VALIDATORS`),
   * - or, one key is missing (being in `CONFIG_VALIDATORS` but not in `config`)
   * - or, one value is invalid (`CONFIG_VALIDATORS[key](value)` returned false)
   *
   * @see #validators
   * @param {Object} config The configuration object to validate
   * @return void Never return anything
   */
  HubSpotOAuthClient.validateConfiguration = function validateConfiguration(config) {

    // Check for unknown parameters
    Object.keys(config).forEach(function(key) {
      if (!(key in HubSpotOAuthClient.CONFIG_VALIDATORS)) {
        throw new Error(
          'Unknown config parameter "' + key + '"'
        );
      }
    });

    // Validate config parameters exist and are valid
    Object.keys(HubSpotOAuthClient.CONFIG_VALIDATORS).forEach(function(key) {
      if (!(key in config)) {
        throw new Error('Missing parameter "' + key + '" from config');
      }
      var value = config[key];
      if (!HubSpotOAuthClient.CONFIG_VALIDATORS[key](value)) {
        throw new Error('Parameter "' + key + '" in config is invalid: ' +
          '"' + value + '"');
      }
    });
  };

  /**
   * Check whether a Hub ID seems valid or not (ie does not actually test if a Hub exists)
   *
   * @param  {Integer|String} hubId The Hub ID to test
   * @return {Boolean} Returns `true` if the Hub ID is in the correct format, `false` otherwise`.
   */
  HubSpotOAuthClient.isHubIdValid = function isHubIdValid(hubId) {
    var hubIdNumber = Number(hubId);
    return !isNaN(hubIdNumber) && hubIdNumber > 0;
  };

  prototype = HubSpotOAuthClient.prototype;

  prototype.isOpen = function isOpen() {
    return this._promiseWindow && this._promiseWindow.isOpen();
  };

  /**
   * Set the Hub ID
   *
   * @throws {HubSpotOAuthClient.PendingIntegrationError} If an OAuth request has already been
   *                                                      initiated with a different Hub ID
   * @param {Number} hubId The new Hub ID
   * @throws {Error} If the given hub id is invalid
   * @return {HubSpotOAuthClient} Returns this object to allow chaining.
   * @protected
   */
  prototype._setHubId = function setHubId(hubId) {

    // Check the given hub id is valid
    if (!this.constructor.isHubIdValid(hubId)) {
      throw new Error('Invalid HubSpot id "' + hubId + '"');
    }

    // Check we don't have a pending integration
    if (this.isOpen()) {
      throw new this.constructor.PendingIntegrationError(
        'Cannot set Hub ID to "' + '". A OAuth integration is pending'
      );
    }

    this.hubId = Number(hubId);
  };

  // TODO
  prototype._getIntegrationURI = function _getIntegrationURI() {
    return this.config.integrationURI + '?' + [
        'client_id=' + fixedEncodeURIComponent(this.config.clientId),
        'portalId=' + fixedEncodeURIComponent(this.hubId),
        'scope=' + fixedEncodeURIComponent(this.config.applicationScope.join(' ')).replace('%20', '+'),
        'redirect_uri=' + fixedEncodeURIComponent(this.config.redirectURI)
      ].join('&');
  };

  prototype._getPromiseWindow = function() {
    if (!this._promiseWindow) {
      this._promiseWindow = new PromiseWindow(
        this._getIntegrationURI(),
        extend({}, this._config, {
          onPostMessage: function onPostMessage(event) {
            if ('hubId' in event.data) {
              event.data.hubId = Number(event.data.hubId);
            }
            PromiseWindow.defaultConfig.onPostMessage.call(this, event);
          }
        })
      );
    }
    return this._promiseWindow;
  };

  /**
   * Initiate an OAuth integration
   *
   * 1. Opens a HubSpot OAuth window
   * 2. Redirect to HubSpot login page (optional: if user is not logged into HubSpot)
   * 3. Redirect to HubSpot
   * 4. Redirect to the configured
   *
   * Rejection causes:
   * - TODO document HubSpot errors
   * - 'canceled': user has closed the window
   *
   * @throws {HubSpotOAuthClient.PendingIntegrationError} If an OAuth request has already been
   *                                                           initiated with a different Hub ID
   * @params {Number} hubId The user's HubSpot Hub ID
   * @return {Promise} Returns a Promise that will be either fulfilled (Oauth success) or rejected
   *                   (canceled, or HubSpot error, timed out)
   */
  prototype.initiateIntegration = function initiateIntegration(hubId) {

    // Set the Hub ID
    if (arguments.length === 0) {
      throw new Error('Missing Hub ID');
    }
    this._setHubId(hubId);

    return this._getPromiseWindow().open();
  };

  // Exports PromiseWindow to the global scope
  /* jshint ignore:start */
  if (typeof define === 'function' && define.amd) {
    define([], function() { return HubSpotOAuthClient });
  } else if (typeof exports === 'object') {
    module.exports = HubSpotOAuthClient;
  } else {
    root.HubSpotOAuthClient = HubSpotOAuthClient;
  }
  /* jshint ignore:end */

})();
