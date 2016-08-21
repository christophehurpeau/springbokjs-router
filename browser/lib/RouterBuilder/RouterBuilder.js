'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray = /**
                      * @function
                     */ function () { /**
                                       * @function
                                       * @param arr
                                       * @param i
                                      */ function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return (/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @function
                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @param arr
                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @param i
                                                                                                                                                                                                                                                                                                                                                                                                                                                          */ function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } } ); }();

var _createClass = /**
                    * @function
                   */ function () { /**
                                     * @function
                                     * @param target
                                     * @param props
                                    */ function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return (/**
                                                                                                                                                                                                                                                                                                                                                                            * @function
                                                                                                                                                                                                                                                                                                                                                                            * @param Constructor
                                                                                                                                                                                                                                                                                                                                                                            * @param protoProps
                                                                                                                                                                                                                                                                                                                                                                            * @param staticProps
                                                                                                                                                                                                                                                                                                                                                                           */ function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; } ); }();
// import RouterRouteCommon from '../RouterRoute/Common';


var _Router = require('../Router');

var _Router2 = _interopRequireDefault(_Router);

var _Route = require('../RouterRoute/Route');

var _Route2 = _interopRequireDefault(_Route);

var _Segment = require('../RouterRoute/Segment');

var _Segment2 = _interopRequireDefault(_Segment);

var _Lang = require('../RouterRoute/Lang');

var _Lang2 = _interopRequireDefault(_Lang);

var _UrlGenerator = require('../UrlGenerator/UrlGenerator');

var _UrlGenerator2 = _interopRequireDefault(_UrlGenerator);

var _UrlGeneratorNamedParamPart = require('../UrlGenerator/UrlGeneratorNamedParamPart');

var _UrlGeneratorNamedParamPart2 = _interopRequireDefault(_UrlGeneratorNamedParamPart);

var _UrlGeneratorOptionalGroupPart = require('../UrlGenerator/UrlGeneratorOptionalGroupPart');

var _UrlGeneratorOptionalGroupPart2 = _interopRequireDefault(_UrlGeneratorOptionalGroupPart);

var _UrlGeneratorPartArray = require('../UrlGenerator/UrlGeneratorPartArray');

var _UrlGeneratorPartArray2 = _interopRequireDefault(_UrlGeneratorPartArray);

var _UrlGeneratorStringPart = require('../UrlGenerator/UrlGeneratorStringPart');

var _UrlGeneratorStringPart2 = _interopRequireDefault(_UrlGeneratorStringPart);

var _RouterBuilderSegment = require('./RouterBuilderSegment');

var _RouterBuilderSegment2 = _interopRequireDefault(_RouterBuilderSegment);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param instance
 * @param Constructor
*/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const regExpStartingSlash = /^\/+/;
// const regExpEndingSlash = /\/+$/;

var object2map = function object2map(object) {
    return new Map(Object.keys(object).map(function (key) {
        return [key, object[key]];
    }));
};

var RouterBuilder = /**
                     * @function
                    */function () {
    /**
     * @param {RoutesTranslations} routesTranslations
     * @param {Array} allLangs Array of all langs
    * @function
    */

    function RouterBuilder(routesTranslations, allLangs) {
        _classCallCheck(this, RouterBuilder);

        this._routesTranslations = routesTranslations;
        this._allLangs = allLangs;
        this.router = new _Router2.default(routesTranslations);

        this.regExpNamedParam = /\$\{([a-zA-Z]+)}/g;
        this.translatableRoutePart = /\/([a-zA-Z_]+)/g;
        this.translatableRouteNamedParamValue = /^[a-zA-Z\|_]+$/g;
        this.regExpNamedParamOrOptionalPart = /(?:\$\{([a-zA-Z]+)})|(?:\[([^\]]+)\])/g;
    }

    /**
     * @param {string} lang
     * @param {string} string
     * @return {string}
     */


    _createClass(RouterBuilder, [{
        key: 'translate',
        value: /**
                * @function
                * @param lang
                * @param string
               */function translate(lang, string) {
            var lstring = string.toLowerCase();
            return this._routesTranslations.translate(lstring, lang);
        }

        /**
         * @param {Map} routes
         */

    }, {
        key: 'fromMap',
        value: /**
                * @function
                * @param routes
               */function fromMap(routes) {
            var _this = this;

            routes.forEach(function (route, routeKey) {
                _this.add(routeKey, routeKey, route[0], {
                    namedParamsDefinition: route.length > 1 ? route[1] : undefined,
                    routeLangs: route.length > 2 ? route[2] || {} : {},
                    extension: route.length > 3 ? route[3] : undefined
                });
            });
        }

        /**
         * @param {string|Object} routeKeyOrRoute key to get the route. If object: { routeKey, routeUrl, controller, action, namedParamsDefinition, routeLangs, extension }
         * @param {string|Function} routeUrlOrSegmentBuilder url, or if function: segment
         * @param {string} controllerAndActionSeparatedByDot
         * @param {Map} [options.namedParamsDefinition]
         * @param {Map} [options.routeLangs]
         * @param {string} [options.extension]
         * If routeKey is an object:
         * @param {string} routeKeyOrRoute.routeKeyOrRoute key to get the route
         * @param {string} routeKeyOrRoute.routeUrl
         * @param {string} [routeKeyOrRoute.controller]
         * @param {string} [routeKeyOrRoute.action]
         * @param {Map} [routeKeyOrRoute.namedParamsDefinition]
         * @param {Map} [routeKeyOrRoute.routeLangs]
         * @param {string} [routeKeyOrRoute.extension]
         */

    }, {
        key: 'add',
        value: /**
                * @function
                * @param routeKeyOrRoute
                * @param routeUrlOrSegmentBuilder
                * @param controllerAndActionSeparatedByDot
                * @param options
               */function add(routeKeyOrRoute, routeUrlOrSegmentBuilder, controllerAndActionSeparatedByDot, options) {
            if (typeof routeKeyOrRoute === 'string') {
                var _controllerAndActionS = controllerAndActionSeparatedByDot.split('.');

                var _controllerAndActionS2 = _slicedToArray(_controllerAndActionS, 2);

                var _controller = _controllerAndActionS2[0];
                var _action = _controllerAndActionS2[1];

                routeKeyOrRoute = {
                    key: routeKeyOrRoute,
                    url: routeUrlOrSegmentBuilder,
                    controller: _controller,
                    action: _action,
                    namedParamsDefinition: options && options.namedParamsDefinition,
                    routeLangs: options && options.routeLangs,
                    extension: options && options.extension
                };
            }

            var _routeKeyOrRoute = routeKeyOrRoute;
            var key = _routeKeyOrRoute.key;
            var url = _routeKeyOrRoute.url;
            var controller = _routeKeyOrRoute.controller;
            var action = _routeKeyOrRoute.action;
            var namedParamsDefinition = _routeKeyOrRoute.namedParamsDefinition;
            var routeLangs = _routeKeyOrRoute.routeLangs;
            var extension = _routeKeyOrRoute.extension;


            if (typeof routeUrlOrSegmentBuilder === 'function') {
                return this.addSegment(url, { namedParamsDefinition: namedParamsDefinition, routeLangs: routeLangs, extension: extension }, routeUrlOrSegmentBuilder);
            }

            var route = this._createRoute(key, undefined, url, { controller: controller, action: action }, namedParamsDefinition, routeLangs, extension);
            this.router.addRoute(key, route);
            return this;
        }

        /**
         * @param {string} routeUrl
         * @param {Map} [options.namedParamsDefinition]
         * @param {Map} [options.routeLangs]
         * @param {Function} buildSegment
         */

    }, {
        key: 'addSegment',
        value: /**
                * @function
                * @param {string} routeUrl
                * @param {*} options
                * @param {Function} buildSegment
               */function addSegment(routeUrl, options, buildSegment) {
            if (typeof options === 'function') {
                buildSegment = options;
                options = {};
            }

            var route = this._createRouteSegment(undefined, routeUrl, options.namedParamsDefinition, options.routeLangs);
            var segment = new _RouterBuilderSegment2.default(this, route, undefined);
            buildSegment(segment);
            this.router.addRoute(undefined, route);
            return this;
        }

        /**
         * @param {RouterRouteSegment} [parent]
         * @param {string} routeUrl
         * @param {Map} namedParamsDefinition
         * @param {Map} routeLangs
         * @return {RouterRouteCommon}
         */

    }, {
        key: '_createRouteSegment',
        value: /**
                * @function
                * @param {*} parent
                * @param {string} routeUrl
                * @param {*} namedParamsDefinition
                * @param {*} routeLangs
               */function _createRouteSegment(parent, routeUrl, namedParamsDefinition, routeLangs) {
            return this._createRoute(null, parent, routeUrl, undefined, namedParamsDefinition, routeLangs, undefined);
        }

        /**
         * @param {string} [key] if null this is a segment
         * @param {RouterRouteSegment} [parent]
         * @param {string} routeUrl
         * @param {string|Object} controllerAndAction
         * @param {Object} [namedParamsDefinition]
         * @param {Map|Object} [routeLangs]
         * @param {string} [extension]
         * @return {RouterRouteCommon}
         */

    }, {
        key: '_createRoute',
        value: /**
                * @function
                * @param {*} key
                * @param {*} parent
                * @param {string} routeUrl
                * @param {*} controllerAndAction
                * @param {*} namedParamsDefinition
                * @param {*} routeLangs
                * @param {*} extension
               */function _createRoute(key, parent, routeUrl, controllerAndAction, namedParamsDefinition, routeLangs, extension) {
            var _this2 = this;

            var isSegment = key == null;
            if (!isSegment) {
                if (typeof controllerAndAction === 'string') {
                    controllerAndAction = controllerAndAction.split('.');
                    controllerAndAction = {
                        controller: controllerAndAction[0],
                        action: controllerAndAction[1]
                    };
                }
            } else if (controllerAndAction) {
                throw new Error('Cannot have controllerAndAction for segment "' + routeUrl + '"');
            }

            if (routeLangs == null) {
                routeLangs = new Map();
            } else {
                routeLangs = object2map(routeLangs);
            }

            // -- Route langs --

            if (routeLangs.size !== 0) {
                this._allLangs.forEach(function (lang) {
                    if (!routeLangs.has(lang)) {
                        if (lang === 'en') {
                            routeLangs.set('en', routeUrl);
                        } else {
                            throw new Error('Missing lang ' + lang + '" for route "' + routeUrl + '"');
                        }
                    }
                });
            } else if (!routeUrl.match(this.translatableRoutePart)) {
                this._allLangs.forEach(function (lang) {
                    routeLangs.set(lang, routeUrl);
                });
            } else {
                this._allLangs.forEach(function (lang) {
                    routeLangs.set(lang, routeUrl.replace(_this2.translatableRoutePart, function (str, p1) {
                        return '/' + _this2.translate(lang, p1);
                    }));
                });
            }

            var paramNames = [];
            routeLangs.get(this._allLangs[0]).replace(this.regExpNamedParam, function (str, paramName) {
                paramNames.push(paramName);
            });

            var finalRoute = isSegment ? new _Segment2.default(paramNames) : new _Route2.default(key, controllerAndAction.controller, controllerAndAction.action, extension, paramNames);

            routeLangs.forEach(function (routeLang, lang) {
                var translate = _this2.translate.bind(_this2, lang);
                var specialEnd = false;
                var specialEnd2 = false;
                var routeLangRegExp = void 0;

                if (!isSegment && (specialEnd = routeLang.endsWith('/*'))) {
                    routeLangRegExp = routeLang.slice(0, -2);
                } else if (!isSegment && (specialEnd2 = routeLang.endsWith('/*]'))) {
                    routeLangRegExp = routeLang.slice(0, -3) + routeLang.slice(-1);
                } else {
                    routeLangRegExp = routeLang;
                }

                routeLangRegExp = routeLangRegExp.replace(/\//g, '\\/').replace(/-/g, '\\-').replace(/\*/g, '(.*)').replace(/\[/g, '(').replace(/]/g, ')?').replace(/\(/g, '(?:');

                if (specialEnd) {
                    routeLangRegExp = routeLangRegExp + '(?:\\/([^.]*))?';
                } else if (specialEnd2) {
                    // ends now is : /*)?
                    routeLangRegExp = routeLangRegExp.slice(0, -2) + '(?:\\/(.*))?' + routeLangRegExp.slice(-2);
                }

                var extensionRegExp = function () {
                    if (isSegment || extension == null) {
                        return '';
                    }

                    if (extension === 'html') {
                        return '(?:\\.(html))?';
                    }

                    return '\\.(' + extension + ')';
                }();

                var replacedRegExp = routeLangRegExp.replace(_this2.regExpNamedParam, function (str, paramName) {
                    if (namedParamsDefinition && namedParamsDefinition[paramName]) {
                        var paramDefVal = namedParamsDefinition[paramName];
                        if (typeof paramDefVal === 'string') {
                            if (paramDefVal.match(_this2.translatableRouteNamedParamValue)) {
                                paramDefVal = paramDefVal.split('|').map(translate).join('|');
                            }
                        } else if (paramDefVal instanceof RegExp) {
                            paramDefVal = paramDefVal.source;
                        } else {
                            paramDefVal = paramDefVal[lang];
                        }

                        return paramDefVal === 'id' ? '([0-9]+)' : '(' + paramDefVal.replace('(', '(?:') + ')';
                    }

                    if (paramName === 'id') {
                        return '([0-9]+)';
                    }

                    return '([^\\/.]+)';
                });

                if (!isSegment && specialEnd) {
                    routeLang = routeLang.slice(0, -2);
                } else if (!isSegment && specialEnd2) {
                    routeLang = routeLang.slice(0, -3) + routeLang.slice(-1);
                }

                var regExpNamedParamOrOptionalPart = _this2.regExpNamedParamOrOptionalPart;
                var parts = routeLang.length === 0 ? null : /**
                                                             * @function
                                                             * @param routeLangPart
                                                            */function buildParts(routeLangPart) {
                    var parts = [];
                    var index = 0;
                    routeLangPart.replace(regExpNamedParamOrOptionalPart, function (match, paramName, optionalGroup, offset) {
                        if (offset > index) {
                            parts.push(new _UrlGeneratorStringPart2.default(routeLang.substring(index, offset)));
                        }

                        index = offset + match.length;

                        if (optionalGroup) {
                            var optionalGroupParts = buildParts(optionalGroup);
                            parts.push(new _UrlGeneratorOptionalGroupPart2.default(optionalGroupParts));
                        } else {
                            parts.push(new _UrlGeneratorNamedParamPart2.default(paramName, translate));
                        }

                        return match;
                    });

                    if (index < routeLangPart.length) {
                        parts.push(new _UrlGeneratorStringPart2.default(routeLang.substring(index)));
                    }

                    if (parts.length === 0) {
                        throw new Error(routeLangPart);
                    }

                    if (parts.length === 1) {
                        return parts[0];
                    }

                    return new _UrlGeneratorPartArray2.default(parts);
                }(routeLang);

                var urlGeneratorParts = void 0;
                if (parent != null) {
                    var parentParts = parent.routes.get(lang).urlGenerator.parts;
                    var mergedParts = parts === null ? parentParts : new _UrlGeneratorPartArray2.default([parentParts, parts]);
                    urlGeneratorParts = new _UrlGenerator2.default(mergedParts, extension);
                } else {
                    urlGeneratorParts = new _UrlGenerator2.default(parts, extension);
                }

                finalRoute.set(lang, new _Lang2.default(new RegExp('^' + replacedRegExp + extensionRegExp + (isSegment ? '(.*)$' : '$')), urlGeneratorParts));
            });

            return finalRoute;
        }

        /**
         * Add default routes
         */

    }, {
        key: 'addDefaultRoutes',
        value: /**
                * @function
               */function addDefaultRoutes() {
            this.addSegment('/${controller}', { extension: 'html' }, function (segment) {
                segment.add('default', '/${action}/*', 'site.index', { extension: 'html' }).defaultRoute('defaultSimple', 'site.index', { extension: 'html' });
            });

            return this;
        }
    }]);

    return RouterBuilder;
}();

exports.default = RouterBuilder;
//# sourceMappingURL=RouterBuilder.js.map