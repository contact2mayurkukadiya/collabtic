(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['axios'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('axios'));
  } else {
    root.OTKAnalytics = factory(); // eslint-disable-line
  }
}(this, function (axios) {
  // this is where I defined my module implementation

  /**
   * If we're in a node environment, we'll use axios to make requests
   */
  let server = false;
  let url;

  /**
   * Creates and sets cookie
   * @param {String} name - Name of the component/module
   * @param {String} value - The uuid
   * @param {Number} days - Days for custom expiration
   * @return {String} - The original uuid (value)
   */
  const createCookie = (name, value, days) => {
    if (server) {
      return value;
    }
    let expires = '';
    let date;
    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = ['; expires=', date.toGMTString()].join('');
    }
    const guid = [name, '=', value, expires, '; path=/'].join('');
    document.cookie = guid;
    return value;
  };

  /**
   * Checks for existing cookie.  If exists, returns uuid, else null.
   * @param {String} name - The cookie name (key)
   * @return {String | Null}
   */
  const readCookie = (name) => {
    if (server) {
      return null;
    }
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    let c;
    for (let i = 0; i < ca.length; i++) { // eslint-disable-line no-plusplus
      c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  };

  /**
   * Generates a unique id
   * @returns {String}
   */
  const generateUuid = () => {
    // http://www.ietf.org/rfc/rfc4122.txt
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) { // eslint-disable-line no-plusplus
      s.push(hexDigits.substr(Math.floor(Math.random() * 0x10), 1));
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = '4';
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // eslint-disable-line no-bitwise
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
  };

  /**
   * Check for a cookie. Create one if it doesn't exists
   * @param {String} name
   * @returns {String}
   */
  const updateCookie = name => readCookie(name) || createCookie(name, generateUuid(), 7);

  const validateData = (data) => {
    if (!data.clientVersion) {
      console.log('Error. The clientVersion field cannot be null in the log entry');
      throw new Error('The clientVersion field cannot be null in the log entry');
    }
    if (!data.source) {
      console.log('Error. The source field cannot be null in the log entry');
      throw new Error('The source field cannot be null in the log entry');
    }
    if (!data.componentId) {
      console.log('Error. The componentId field cannot be null in the log entry');
      throw new Error('The componentId field cannot be null in the log entry');
    }
    if (!data.name) {
      console.log('Error. The name field cannot be null in the log entry');
      throw new Error('The guid field cannot be null in the log entry');
    }

    const logVersion = data.logVersion || '2';
    const clientSystemTime = data.clientSystemTime || new Date().getTime();
    return Object.assign({}, data, {
      logVersion,
      clientSystemTime,
    });
  };

  /**
   * Send analytics data to the analytics server
   * @param {Object} data
   */
  const sendData = (data) => {
    const analyticsData = validateData(data);
    if (server) {
      axios.post(url, analyticsData);
    } else {
      const http = new XMLHttpRequest();
      http.open('POST', url, true);
      http.setRequestHeader('Content-type', 'application/json');
      http.send(JSON.stringify(analyticsData));
    }
  };

  /** Class representing OpenTok Analytics Logging. */
  class OTKAnalytics {
    /**
     * Create an instance of OTKAnalytics
     * @param {Object} data
     * @param {String} data.clientVersion
     * @param {String} data.source
     * @param {String} data.componentId
     * @param {String} data.name
     * @param {Object} options
     * @param {Boolean} options.server - Server-side logging?
     * @param {String} options.proxyUrl - The IP Proxy URL (see https://tokbox.com/developer/guides/ip-proxy)
     * @param {String} options.loggingUrl - Logging URL
     */
    constructor(data, options) {
      this.analyticsData = data;
      server = options && options.server;
      let loggingUrl = 'hlg.tokbox.com/prod/logging/ClientEvent';
      if (options && options.loggingUrl) {
        loggingUrl = options.loggingUrl;
      }
      url = (options && options.proxyUrl && `${options.proxyUrl}/${loggingUrl}`) || `https://${loggingUrl}`;
      this.analyticsData.guid = updateCookie(data.name);
    }

    addSessionInfo(data) {
      if (!data.sessionId) {
        console.log('Error. The sessionId field cannot be null in the log entry');
        throw new Error('The sessionId field cannot be null in the log entry');
      }
      this.analyticsData.sessionId = data.sessionId;

      if (!data.connectionId) {
        console.log('Error. The connectionId field cannot be null in the log entry');
        throw new Error('The connectionId field cannot be null in the log entry');
      }
      this.analyticsData.connectionId = data.connectionId;

      if (data.partnerId === 0) {
        console.log('Error. The partnerId field cannot be null in the log entry');
        throw new Error('The partnerId field cannot be null in the log entry');
      }
      this.analyticsData.partnerId = data.partnerId;
    }

    logEvent(data) {
      this.analyticsData = Object.assign({}, this.analyticsData, data, { clientSystemTime: new Date().getTime() });
      // send data to analytics server
      sendData(this.analyticsData);
    }
  }

  return OTKAnalytics;
}));
