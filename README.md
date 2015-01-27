hubspot-client-javascript
=========================

[![Build Status](https://img.shields.io/travis/amercier/hubspot-oauth-client/master.svg?style=flat-square)](https://travis-ci.org/amercier/hubspot-oauth-client)
[![Code Climate](https://img.shields.io/codeclimate/github/amercier/hubspot-oauth-client.svg?style=flat-square)](https://codeclimate.com/github/amercier/hubspot-oauth-client)
[![Code Coverage](https://img.shields.io/codeclimate/coverage/github/amercier/hubspot-oauth-client.svg?style=flat-square)](https://codeclimate.com/github/amercier/hubspot-oauth-client)
[![Dependency Status](https://www.versioneye.com/user/projects/54c5577d49fdf2d607000054/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/54c5577d49fdf2d607000054)
[![Dependency Status](https://www.versioneye.com/user/projects/54c555df49fdf25cd9000002/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/54c555df49fdf25cd9000002)

A JavaScript client for the [HubSpot API](http://developers.hubspot.com/).

Installation
------------

    bower install hubspot

Aternatively, download a copy of [hubspot-client.js](dist/hubspot-client.js)
([minified](dist/hubspot-client.min.js)).


Getting started
---------------

### Requirements

Before getting started, you need to:
- [Create a HubSpot developer account](https://app.hubspot.com/developers/signup).
- Create a separate user account, for testing. Alternatively, you can use your developer account for
  both developing and testing.

### Initialize OAuth

- index.html:

```html
<script src="path/to/.../hubspot-oauth-client.js"></script>
```

```javascript
window = new HubSpotOAuthClient({
  clientId: 'cc7ef1d9-d6a5-48c5-bfe8-c3f74f20633b' // your HubSpot application's HubSpot client id
  applicationId: '123456' // your HubSpot application's id
  applicationScope: [ // application scopes
    HubSpotOAuthClient.SCOPES.CONTACTS_READ_WRITE,
    HubSpotOAuthClient.SCOPES.EVENTS_READ_WRITE
  ],
  windowTitle: 'Connect MyAwesomeApp with HubSpot',
  redirectUrl: 'http://..../oauth-callback.html'
});
```

- oauth-callback.html

```javascript
window.PostMessage("hubspot-callback", location.href);
```
