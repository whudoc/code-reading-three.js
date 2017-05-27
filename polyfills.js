//tzx：这个文档里面重要的用法有：
//  -   首先 polyfill 是 shim，就是一种保证兼容的适配器
//  -   EPSILON 定义为 Math.pow(2,-52)
//  -   Sign（x）返回 {-1，0，1}
//  -   defineProperty
//      -   Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
//      -   语法：Object.defineProperty(obj, prop, descriptor)
//      -   [Object.defineProperty() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
//      -   这个好像有点复杂，以后再看
//      -   这里给 Function 加上了 name 属性
//  -   assign
//      -   Object.assign() 方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
//      -   语法：Object.assign(target, ...sources)
//      -   [Object.assign() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
//      -   assign 的是 reference
//      -   示例代码：
//
//          ```javascript
//          var obj = Object.create({foo: 1}, { // foo 是个继承属性。
//              bar: {
//                  value: 2  // bar 是个不可枚举属性。
//              },
//              baz: {
//                  value: 3,
//                  enumerable: true  // baz 是个自身可枚举属性。
//              }
//          });
//          ```

var copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }

// Polyfills

if ( Number.EPSILON === undefined ) {

    Number.EPSILON = Math.pow( 2, - 52 );

}

//

if ( Math.sign === undefined ) {

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

    Math.sign = function ( x ) {

        return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : + x;               // 最后一个 x 完全不必要，就是返回 0，-1，1 三种情况而已……

    };

}

if ( Function.prototype.name === undefined ) {

    // Missing in IE9-11.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

    Object.defineProperty( Function.prototype, 'name', {

        get: function () {

            return this.toString().match( /^\s*function\s*([^\(\s]*)/ )[ 1 ];

        }

    } );

}

if ( Object.assign === undefined ) {

    // Missing in IE.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

    ( function () {

        Object.assign = function ( target ) {

            'use strict';

            if ( target === undefined || target === null ) {

                throw new TypeError( 'Cannot convert undefined or null to object' );

            }

            var output = Object( target );

            for ( var index = 1; index < arguments.length; index ++ ) {

                var source = arguments[ index ];

                if ( source !== undefined && source !== null ) {

                    for ( var nextKey in source ) {

                        if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

                            output[ nextKey ] = source[ nextKey ];

                        }

                    }

                }

            }

            return output;

        };

    } )();

}
