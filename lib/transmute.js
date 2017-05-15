'use strict';

const _ = require('lodash');

const typeMatch = {
    string: (obj, item, parent, key) => _.get(item, key),
    object: (obj, item, parent, key) => transmuteObject(key, obj),
    array: (obj, item, parent, key) => _.get(item, key[0]).map((arrayItem) => transmuteObject(key[1], obj, arrayItem, item)),
    "function": (obj, item, parent, key) => key(obj, item, parent)
} ;

const transmuteObject = (translation, root, item, parent) => {
    return Object.keys(translation).reduce((r,v) => {
        r[v] = typeMatch[ Array.isArray( translation[v] ) ? 'array' : typeof translation[v] ](root, item || root, parent || root, translation[v]) ;
        return r ;
    }, {});
};

module.exports = transmuteObject ;
