// Generated by CoffeeScript 1.10.0
var Client, appManager, checkLogin, clientDS, createDevice, defaultPermissions, deviceExists, deviceManager, extractCredentials, getCredentialsHeader, getProxy, initAuth, passport, randomString, removeDevice, updateDevice, urlHelper;

Client = require('request-json').JsonClient;

passport = require('passport');

urlHelper = require('cozy-url-sdk');

deviceManager = require('../models/device');

appManager = require('../lib/app_manager');

getProxy = require('../lib/proxy').getProxy;

clientDS = new Client(urlHelper.dataSystem.url());

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  clientDS.setBasicAuth(process.env.NAME, process.env.TOKEN);
}

defaultPermissions = {
  'File': {
    'description': 'Usefull to synchronize your files'
  },
  'Folder': {
    'description': 'Usefull to synchronize your folder'
  },
  'Binary': {
    'description': 'Usefull to synchronize the content of your files'
  },
  'Notification': {
    'description': 'Usefull to synchronize cozy notifications'
  }
};

randomString = function(length) {
  var string;
  string = "";
  while (string.length < length) {
    string = string + Math.random().toString(36).substr(2);
  }
  return string.substr(0, length);
};

extractCredentials = function(header) {
  var authDevice, password, username;
  if (header != null) {
    authDevice = header.replace('Basic ', '');
    authDevice = new Buffer(authDevice, 'base64').toString('utf8');
    username = authDevice.substr(0, authDevice.indexOf(':'));
    password = authDevice.substr(authDevice.indexOf(':') + 1);
    return [username, password];
  } else {
    return ["", ""];
  }
};

getCredentialsHeader = function() {
  var basicCredentials, credentials;
  credentials = process.env.NAME + ":" + process.env.TOKEN;
  basicCredentials = new Buffer(credentials).toString('base64');
  return "Basic " + basicCredentials;
};

deviceExists = function(login, cb) {
  return clientDS.post("request/device/byLogin/", {
    key: login
  }, function(err, result, body) {
    var ref;
    if (err) {
      return cb(err);
    } else if (body.length === 0) {
      return cb(null, false);
    } else {
      return cb(null, (ref = body[0]) != null ? ref.value : void 0);
    }
  });
};

checkLogin = function(login, wantExist, cb) {
  var error;
  if (login == null) {
    error = new Error("Name isn't defined in req.body.login");
    error.status = 400;
    return cb(error);
  } else {
    return deviceExists(login, function(err, device) {
      if (err) {
        return next(err);
      } else if (device) {
        if (wantExist) {
          return cb(null, device);
        } else {
          error = new Error("This name is already used");
          error.status = 400;
          return cb(error);
        }
      } else {
        if (wantExist) {
          error = new Error("This device doesn't exist");
          error.status = 400;
          return cb(error);
        } else {
          return cb();
        }
      }
    });
  }
};

initAuth = function(req, cb) {
  var password, ref, user, username;
  ref = extractCredentials(req.headers['authorization']), username = ref[0], password = ref[1];
  user = {};
  user.body = {
    password: password
  };
  req.headers['authorization'] = void 0;
  return cb(user);
};

createDevice = function(device, cb) {
  var access;
  device.docType = "Device";
  access = {
    login: device.login,
    password: randomString(32),
    permissions: device.permissions || defaultPermissions
  };
  delete device.permissions;
  return clientDS.post("data/", device, function(err, result, docInfo) {
    if (err != null) {
      return cb(err);
    }
    access.app = docInfo._id;
    return clientDS.post('access/', access, function(err, result, body) {
      var data;
      if (err != null) {
        return cb(err);
      }
      data = {
        password: access.password,
        login: device.login,
        permissions: access.permissions
      };
      return cb(null, data);
    });
  });
};

updateDevice = function(oldDevice, device, cb) {
  var path;
  path = "request/access/byApp/";
  return clientDS.post(path, {
    key: oldDevice.id
  }, function(err, result, accesses) {
    var access;
    access = {
      login: device.login,
      password: randomString(32),
      app: oldDevice.id,
      permissions: device.permissions || defaultPermissions
    };
    path = "access/" + access.app + "/";
    return clientDS.put(path, access, function(err, result, body) {
      var error;
      if (err != null) {
        console.log(err);
        error = new Error(err);
        return cb(error);
      } else {
        oldDevice.login = device.login;
        delete oldDevice.permissions;
        path = "data/" + oldDevice.id;
        return clientDS.put(path, oldDevice, function(err, result, body) {
          var data;
          data = {
            password: access.password,
            login: device.login,
            permissions: access.permissions
          };
          return cb(null, data);
        });
      }
    });
  });
};

removeDevice = function(device, cb) {
  var id;
  id = device._id;
  return clientDS.del("access/" + id + "/", function(err, result, body) {
    var error;
    if (err != null) {
      error = new Error(err);
      error.status = 400;
      return cd(error);
    } else {
      return clientDS.del("data/" + id + "/", function(err, result, body) {
        if (err != null) {
          error = new Error(err);
          error.status = 400;
          return cd(error);
        } else {
          return cb(null);
        }
      });
    }
  });
};

module.exports.create = function(req, res, next) {
  var authenticator;
  authenticator = passport.authenticate('local', function(err, user) {
    var device, error;
    if (err) {
      console.log(err);
      return next(err);
    } else if (user === void 0 || !user) {
      error = new Error("Bad credentials");
      error.status = 401;
      return next(error);
    } else {
      device = req.body;
      return checkLogin(device.login, false, function(err) {
        if (err != null) {
          return next(err);
        }
        device.docType = "Device";
        return createDevice(device, function(err, data) {
          if (err != null) {
            return next(err);
          } else {
            return res.status(201).send(data);
          }
        });
      });
    }
  });
  return initAuth(req, function(user) {
    return authenticator(user, res);
  });
};

module.exports.update = function(req, res, next) {
  var authenticator;
  authenticator = passport.authenticate('local', function(err, user) {
    var device, error, login;
    if (err) {
      console.log(err);
      return next(err);
    } else if (user === void 0 || !user) {
      error = new Error("Bad credentials");
      error.status = 401;
      return next(error);
    } else {
      login = req.params.login;
      device = req.body;
      return checkLogin(login, true, function(err, oldDevice) {
        if (err != null) {
          return next(err);
        }
        device.docType = "Device";
        return updateDevice(oldDevice, device, function(err, data) {
          if (err != null) {
            return next(err);
          } else {
            return res.status(200).send(data);
          }
        });
      });
    }
  });
  return initAuth(req, function(user) {
    return authenticator(user, res);
  });
};

module.exports.remove = function(req, res, next) {
  var authenticator;
  authenticator = passport.authenticate('local', function(err, user) {
    var error, login;
    if (err) {
      console.log(err);
      return next(err);
    } else if (user === void 0 || !user) {
      error = new Error("Bad credentials");
      error.status = 401;
      return next(error);
    } else {
      login = req.params.login;
      return checkLogin(login, true, function(err, device) {
        if (err != null) {
          return next(err);
        }
        return removeDevice(device, function(err) {
          if (err != null) {
            return next(err);
          } else {
            return res.sendStatus(204);
          }
        });
      });
    }
  });
  return initAuth(req, function(user) {
    return authenticator(user, res);
  });
};

module.exports.replication = function(req, res, next) {
  var password, ref, username;
  ref = extractCredentials(req.headers['authorization']), username = ref[0], password = ref[1];
  return deviceManager.isAuthenticated(username, password, function(auth) {
    var error;
    if (auth) {
      return getProxy().web(req, res, {
        target: urlHelper.dataSystem.url()
      });
    } else {
      error = new Error("Request unauthorized");
      error.status = 401;
      return next(error);
    }
  });
};

module.exports.dsApi = function(req, res, next) {
  var password, ref, username;
  ref = extractCredentials(req.headers['authorization']), username = ref[0], password = ref[1];
  return deviceManager.isAuthenticated(username, password, function(auth) {
    var error;
    if (auth) {
      req.url = req.url.replace('ds-api/', '');
      return getProxy().web(req, res, {
        target: urlHelper.dataSystem.url()
      });
    } else {
      error = new Error("Request unauthorized");
      error.status = 401;
      return next(error);
    }
  });
};

module.exports.getVersions = function(req, res, next) {
  var password, ref, username;
  ref = extractCredentials(req.headers['authorization']), username = ref[0], password = ref[1];
  return deviceManager.isAuthenticated(username, password, function(auth) {
    var error;
    if (auth) {
      return appManager.versions(function(err, apps) {
        var error;
        if (err != null) {
          error = new Error(err);
          error.status = 400;
          return next(error);
        } else {
          return res.status(200).send(apps);
        }
      });
    } else {
      error = new Error("Request unauthorized");
      error.status = 401;
      return next(error);
    }
  });
};

module.exports.oldReplication = function(req, res, next) {
  var password, ref, username;
  ref = extractCredentials(req.headers['authorization']), username = ref[0], password = ref[1];
  return deviceManager.isAuthenticated(username, password, function(auth) {
    var error;
    if (auth) {
      if (process.env.NODE_ENV === "production") {
        req.headers['authorization'] = getCredentialsHeader();
      } else {
        req.headers['authorization'] = null;
      }
      return getProxy().web(req, res, {
        target: urlHelper.couch.url()
      });
    } else {
      error = new Error("Request unauthorized");
      error.status = 401;
      return next(error);
    }
  });
};
