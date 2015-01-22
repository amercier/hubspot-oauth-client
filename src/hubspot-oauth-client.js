/**
 * HubSpot OAuth Client
 *
 * A JavaScript SDK for the HubSpot API that is used to facilitate OAuth authentication with
 * HubSpot.
 *
 * see https://github.com/amercier/hubspot-oauth-client
 */
(function(exports) {
  "use strict";

  var HubSpotOAuthClient;

  /**
   * Merge objects
   *
   * @param {Object} ... Objects to merge
   * @return {Object} Returns a new `Object` that contains the given objects values, merged
   *                  together. If a key appear in more than one parameters, the last one is kept.
   */
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
    return typeof number === "number" && !isNaN(number);
  }

  /**
   * Create a config string for a centered popup config
   *
   * @param  {Number} width  Width of the popup window
   * @param  {Number} height Width of the popup window
   * @return {Stirng} Returns the modal config
   */
  function popupWindowConfig(width, height) {
    // Fixes dual-screen position
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left,
        dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top,
        w = window.innerWidth || document.documentElement.clientWidth || screen.width,
        h = window.innerHeight || document.documentElement.clientHeight || screen.height,
        left = (w / 2) - (width / 2) + dualScreenLeft,
        top =  (h / 2) - (height / 2) + dualScreenTop;

    return "scrollbars=yes, width=" + width + ", height=" + height +
      ", top=" + top + ", left=" + left;
  }

  /**
   * Create a new HubSpot Client
   *
   * @param {Object} config Configuration
   * @param {config} config.clientId [description]
   * @constructor
   */
  HubSpotOAuthClient = function HubSpotOAuthClient(config) {
    this.constructor.validateConfiguration(merge(this.constructor.DEFAULT_CONFIG, config));
    this.config = config;
    this.callbacks = {
      oAuthSuccess: [],
      oAuthError: []
    };
  };

  /**
   * HubSpot API base URL
   * This should never be modified, unless for testing purposes.
   * @type {String}
   */
  HubSpotOAuthClient.BASE_URL = "https://api.hubapi.com";

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
  HubSpotOAuthClient.SCOPES.OFFLINE = "offline";

  /**
   * Contacts Read/Write scope
   *
   * This application reads your contact information, as well as creates new contacts, contact
   * lists, and contact properties. It can also modify existing contacts, properties, and contact
   * lists.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.CONTACTS_READ_ONLY = "contacts-ro";

  /**
   * Contacts Read-Only scope
   *
   * This application can read your contact information, as well as information about your contact
   * properties and contact lists.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.CONTACTS_READ_WRITE = "contacts-rw";

  /**
   * Blog Read/Write
   *
   * This application can read your blog data, including posts and comments, as well as create new
   * blog posts and comments.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.BLOG_READ_WRITE = "blog-rw";

  /**
   * Events Read/Write
   *
   * This application can read your marketing events, as well as post new ones into your HubSpot
   * account.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.EVENTS_READ_WRITE = "events-rw";

  /**
   * Keywords Read/Write
   *
   * This application can read your keyword data, as well as insert new ones into your HubSpot
   * account.
   *
   * @type {String}
   */
  HubSpotOAuthClient.SCOPES.KEYWORD_READ_WRITE = "keyword-rw";

  /**
   * All application scopes
   * @type {Array}
   */
  HubSpotOAuthClient.SCOPES.ALL = [
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
    windowTitle: "Integrate with HubSpot",
    windowWidth: 600,
    windowHeight: 400
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
    clientId: function validate(id) { return HubSpotOAuthClient.UUID_REGEXP.test(id); },
    applicationId: function validate(id) { return isValidNumber(id); },
    applicationScope: function validate(scope) {
      return getType(scope) === "[object Array]" &&
        scope.every(function filterScopeItem(scopeItem) {
          return HubSpotOAuthClient.SCOPES.ALL.indexOf(scopeItem) !== -1;
        });
    },
    windowTitle: function validate(title) { return typeof title === "string"; },
    windowHeight: function validate(height) { return isValidNumber(height); },
    windowWidth: function validate(width) { return isValidNumber(width); }
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
          "Unknown config parameter \"" + key + "\""
        );
      }
    });

    // Validate config parameters exist and are valid
    Object.keys(HubSpotOAuthClient.CONFIG_VALIDATORS).forEach(function(key) {
      if (!(key in config)) {
        throw new Error("Missing parameter \"" + key + "\" from config");
      }
      var value = config[ key ];
      if (!HubSpotOAuthClient.CONFIG_VALIDATORS[ key ](value)) {
        throw new Error("Parameter \"" + key + "\" in config is invalid: " +
          "\"" + value + "\"");
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

  /**
   * Check whether a OAuth request is pending or not
   *
   * @return {Boolean} [description]
   */
  HubSpotOAuthClient.prototype._hasPendingOAuthIntegration = function _hasPendingOAuthIntegration()
  {
    if (!this._oAuthIntegrationPromise) {
      return false;
    }

    // As Promise/A+ doesn't define a standard way to get current
    var pending = true,
        updateState = function() { pending = false; };
    this._oAuthIntegrationPromise.then(updateState, updateState);
    return pending;
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
  HubSpotOAuthClient.prototype._setHubId = function setHubId(hubId) {
    // Do nothing if this is the same id
    if (hubId === this.hubId) {
      return;
    }

    // Check the given hub id is valid
    if (!this.constructor.isHubIdValid(hubId)) {
      throw new Error("Invalid HubSpot id \"" + hubId + "\"");
    }

    // Check we don't have a pending integration
    if (this._hasPendingOAuthIntegration()) {
      throw new this.constructor.PendingIntegrationError(
        "Cannot set Hub ID to \"" + "\". A OAuth integration is pending"
      );
    }
  };

  /**
   * oAuth callback
   *
   * This method is intended to be run by the page hosting the oAuth callback:
   *
   *     // Notify the parent window or iframe of the result
   *     (window.opener || window.parent).hubspotClient.oAuthCallback();
   *
   * The result (success or failure, and data) is automatically determined from the given
   * parameters.
   *
   * @param {Object} parameters The parameters returned by HubSpot. This object MUST NOT contain the
   *                            access token, for security reasons.
   * @param {Number} parameters.hubId The Hub ID (aka "Portal ID") for which the callback is about
   * @param {Number} parameters.error (optional) The value of the error returned by HubSpot, if any
   * @throws {Error} If `parameters.hubId` is different than the current hub ID
   * @return {void}
   */
  HubSpotOAuthClient.prototype.oAuthCallback = function oAuthCallback(parameters) {
    if (parameters.hubId !== this.hubId) {
      throw new Error("Received a OAuth callback for Hub with id #" + parameters.hubId +
        ", where #" + this.hubId + "was expected");
    }
    if ("error" in parameters) {
      this._rejectOAuthIntegrationPromise(parameters.error);
    } else {
      this._resolveOAuthIntegrationPromise();
    }
  };

  HubSpotOAuthClient.prototype._getOAuthURL = function _getOAuthURL() {
    return this.constructor.BASE_URL + "";
  };

  /**
   * Get the OAuth integration window title
   *
   * @return {String} [description]
   */
  HubSpotOAuthClient.prototype._getWindowTitle = function _getWindowTitle() {
    return this.config.windowTitle;
  };

  /**
   * Get the poup window config
   *
   * @return {String} Returns the window config
   */
  HubSpotOAuthClient.prototype._getWindowConfig = function _getWindowConfig() {
    return popupWindowConfig(this.config.windowWidth, this.config.windowHeight);
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
   * - FIXME document HubSpot errors
   * - "canceled": user has closed the window
   *
   * @throws {HubSpotOAuthClient.PendingIntegrationError} If an OAuth request has already been
   *                                                           initiated with a different Hub ID
   * @params {Number} hubId The user's HubSpot Hub ID
   * @return {Promise} Returns a Promise that will be either fulfilled (Oauth success) or rejected
   *                   (canceled, or HubSpot error, timed out)
   */
  HubSpotOAuthClient.prototype.initiateOAuthIntegration = function initiateOAuthIntegration(hubId) {
    this._setHubId(hubId);

    // Open the window
    this._window = window.open(
      this._getOAuthURL(),
      this._getWindowTitle(),
      this._getWindowConfig()
    );

    // Create the Promise
    this._oAuthIntegrationPromise = new this.constructor.Promise(function(resolve, reject) {
      this._resolveOAuthIntegrationPromise = resolve;
      this._rejectOAuthIntegrationPromise = reject;
    }.bind(this));

    // Automatically reject Promise on "unload" event
    this._window.addEventListener("unload", function() {
      if (this._hasPendingOAuthIntegration()) {
        this._rejectOAuthIntegrationPromise("canceled");
      }
    }.bind(this));

    return this._oAuthIntegrationPromise;
  };

  exports.HubSpotOAuthClient = HubSpotOAuthClient;

})(window);
