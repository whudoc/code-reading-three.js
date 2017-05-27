//tzx：
//  -   两个常量：DEG2RAG 和 RAD2DEG
//  -   UUID 函数
//  -   clamp 函数：clamp(value, min, max)，特别常用
//  -   euclidian modulo of m % n，这是啥？
//  -   mapLinear：Linear mapping from range <a1, a2> to range <b1, b2>
//  -   lerp 这个没啥好说的，lerp(a,b,t)
//  -   smoothstep
//      -   {0，3*x^2 - 2*x^3，1}，运算的时候把 x 提出来最好
//      -   需要 clamp
//      -   [Smoothstep - Wikipedia](https://en.wikipedia.org/wiki/Smoothstep)
//      -   ![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Smoothstep_and_Smootherstep.svg/330px-Smoothstep_and_Smootherstep.svg.png)
//  -   smootherstep：就是 6*x^5-15*x^4+10*x^3
//  -   randInt：因为 Math.random() 只是 0~1，所以用 randInt(a,b) 缩放到 a~b，
//      注意这里：low + Math.floor( Math.random() * ( high - low + 1 ) )，因为这里
//      的 int 的长度是 high-low+1
//  -   randFloat：就不存在长度上的问题，看上去更简洁了。
//  -   randFloatSpread，randFloatSpread(range) 的范围是 (-range/2,range/2)
//  -   rad2deg, deg2rad
//  -   isPowerOfTwo，这里的处理顺序也有点意思，通常都不会传入 0，所以后判断：`( value & ( value - 1 ) ) === 0 && value !== 0` 这里用了判断 1 的个数。
//  -   Math.LN2：The Math.LN2 property represents the natural logarithm of 2, approximately 0.693: Math.LN2=ln(2)≈0.693，还有 LN10。
//      这里说了是 natual log，所以底是 e。
//  -   nearestPowerOfTwo：这里其实不一定是 nearest 的把……`Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) )`
//  -   nextPowerOfTwo：这个特么是什么鬼？

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

var _Math = {

    DEG2RAD: Math.PI / 180,
    RAD2DEG: 180 / Math.PI,

    generateUUID: function () {

        // http://www.broofa.com/Tools/Math.uuid.htm

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
        var uuid = new Array( 36 );
        var rnd = 0, r;

        return function generateUUID() {

            //tzx：
            //  -   36 位
            //  -   带分隔符“-”
            //  -   A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
            //      by minimizing calls to random()

            for ( var i = 0; i < 36; i ++ ) {

                if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                    uuid[ i ] = '-';

                } else if ( i === 14 ) {

                    uuid[ i ] = '4';

                } else {

                    if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

                }

            }

            return uuid.join( '' );

        };

    }(),

    clamp: function ( value, min, max ) {

        return Math.max( min, Math.min( max, value ) );

    },

    // compute euclidian modulo of m % n
    // https://en.wikipedia.org/wiki/Modulo_operation

    //tzx?
    euclideanModulo: function ( n, m ) {

        return ( ( n % m ) + m ) % m;

    },

    // Linear mapping from range <a1, a2> to range <b1, b2>

    mapLinear: function ( x, a1, a2, b1, b2 ) {

        return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

    },

    // https://en.wikipedia.org/wiki/Linear_interpolation

    lerp: function ( x, y, t ) {

        return ( 1 - t ) * x + t * y;

    },

    // http://en.wikipedia.org/wiki/Smoothstep

    smoothstep: function ( x, min, max ) {

        if ( x <= min ) return 0;
        if ( x >= max ) return 1;

        x = ( x - min ) / ( max - min );

        return x * x * ( 3 - 2 * x );

    },

    smootherstep: function ( x, min, max ) {

        if ( x <= min ) return 0;
        if ( x >= max ) return 1;

        x = ( x - min ) / ( max - min );

        return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

    },

    // Random integer from <low, high> interval

    randInt: function ( low, high ) {

        return low + Math.floor( Math.random() * ( high - low + 1 ) );

    },

    // Random float from <low, high> interval

    randFloat: function ( low, high ) {

        return low + Math.random() * ( high - low );

    },

    // Random float from <-range/2, range/2> interval

    randFloatSpread: function ( range ) {

        return range * ( 0.5 - Math.random() );

    },

    degToRad: function ( degrees ) {

        return degrees * _Math.DEG2RAD;

    },

    radToDeg: function ( radians ) {

        return radians * _Math.RAD2DEG;

    },

    isPowerOfTwo: function ( value ) {

        return ( value & ( value - 1 ) ) === 0 && value !== 0;

    },

    nearestPowerOfTwo: function ( value ) {

        return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );

    },

    nextPowerOfTwo: function ( value ) {

        value --;
        value |= value >> 1;
        value |= value >> 2;
        value |= value >> 4;
        value |= value >> 8;
        value |= value >> 16;
        value ++;

        return value;

    }

};


export { _Math };
