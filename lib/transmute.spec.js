'use strict';
/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: 0, func-names: 0, space-before-function-paren: 0, prefer-const: 0, no-shadow: 0 */

const expect = require('chai').expect;
const transmute = require('./transmute');

describe('transmute', function() {

  const inJson = {
    foo1: "bar",
    foo2: {
      subFoo: "value",
      subFoo2: "another value"
    },
    foo3: [{
      "array1": "array1value"
    }]
  };

  it('should transmute keyPaths', done => {
    const translation = {
      "MyFooValue": "foo1",
      "AnotherFooValue": "foo2.subFoo"
    };

    const check = {
      "MyFooValue": "bar",
      "AnotherFooValue": "value"
    };

    const result = transmute(translation, inJson, inJson);
    expect(result).to.eql(check);
    done();

  });

  it('should transmute sub objects', done => {
    const translation = {
      "MyFooValue": "foo1",
      "AnotherFooValue": {
        "SubFooValue": "foo1"

      }
    };

    const check = {
      "MyFooValue": "bar",
      "AnotherFooValue": {
        "SubFooValue": "bar"
      }
    };

    const result = transmute(translation, inJson, inJson);
    expect(result).to.eql(check);
    done();

  });


  it('should transmute with lambdas', done => {
    const translation = {
      "MyFooValue": (root, item, parent) => root.foo1,
      "AnotherFooValue": (root, item, parent) => item.foo2.subFoo
    };

    const check = {
      "MyFooValue": "bar",
      "AnotherFooValue": "value"
    };

    const result = transmute(translation, inJson, inJson);
    expect(result).to.eql(check);
    done();

  });

  it('should transmute with lambdas on arrays', done => {
    const translation = {
      "MyFooValue": (root, item, parent) => root.foo1,
      "AnotherFooValue": (root, item, parent) => item.foo2.subFoo,
      "ArrayValues": (root, item, parent) => item.foo3.map((array) => transmute({
        arrayFoo: "array1",
        parentFoo: (root, item, parent) => parent.foo1
      }, root, array, item))
    };

    const check = {
      "MyFooValue": "bar",
      "AnotherFooValue": "value",
      "ArrayValues": [{
        parentFoo: "bar",
        arrayFoo: "array1value"
      }]
    };

    const result = transmute(translation, inJson, inJson);
    expect(result).to.eql(check);
    done();
  });

  it('should set incorrect keyPaths to undefined', done => {
     const translation = {
       "MyFooValue": "wrongFoo",
       "AnotherFooValue": "wrongFoo"
    };

    const check = {
       "MyFooValue": "bar",
       "AnotherFooValue": "value"
    };

    const result = transmute(translation, inJson, inJson);
    expect(result).to.not.eql(check);
    expect(result).to.eql({MyFooValue: undefined, AnotherFooValue: undefined })
    done();

  });


  it('should transmute with lambdas on inline arrays', done => {
    const translation = {
      "MyFooValue": (root, item, parent) => root.foo1,
      "AnotherFooValue": (root, item, parent) => item.foo2.subFoo,
      "ArrayValues": ["foo3", {
         "arrayFoo": "array1",
         "parentFoo": (root, item, parent) => parent.foo1
      }]
    };

    const check = {
      "MyFooValue": "bar",
      "AnotherFooValue": "value",
      "ArrayValues": [{
        parentFoo: "bar",
        arrayFoo: "array1value"
      }]
    };

    const result = transmute(translation, inJson, inJson);
    expect(result).to.eql(check);
    done();

  });

});
