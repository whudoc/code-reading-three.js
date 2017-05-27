/**
 * @author mrdoob / http://mrdoob.com/
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

import { Object3D } from '../core/Object3D';

function Audio( listener ) {

    Object3D.call( this );

    this.type = 'Audio';

    this.context = listener.context;

    this.gain = this.context.createGain();
    this.gain.connect( listener.getInput() );

    this.autoplay = false;

    this.buffer = null;
    this.loop = false;
    this.startTime = 0;
    this.playbackRate = 1;
    this.isPlaying = false;
    this.hasPlaybackControl = true;
    this.sourceType = 'empty';

    this.filters = [];

}

Audio.prototype = Object.assign( Object.create( Object3D.prototype ), {

    constructor: Audio,

    getOutput: function () {

        return this.gain;

    },

    setNodeSource: function ( audioNode ) {

        this.hasPlaybackControl = false;
        this.sourceType = 'audioNode';
        this.source = audioNode;
        this.connect();

        return this;

    },

    setBuffer: function ( audioBuffer ) {

        this.buffer = audioBuffer;
        this.sourceType = 'buffer';

        if ( this.autoplay ) this.play();

        return this;

    },

    play: function () {

        if ( this.isPlaying === true ) {

            console.warn( 'THREE.Audio: Audio is already playing.' );
            return;

        }

        if ( this.hasPlaybackControl === false ) {

            console.warn( 'THREE.Audio: this Audio has no playback control.' );
            return;

        }

        var source = this.context.createBufferSource();

        source.buffer = this.buffer;
        source.loop = this.loop;
        source.onended = this.onEnded.bind( this );
        source.playbackRate.setValueAtTime( this.playbackRate, this.startTime );
        source.start( 0, this.startTime );

        this.isPlaying = true;

        this.source = source;

        return this.connect();

    },

    pause: function () {

        if ( this.hasPlaybackControl === false ) {

            console.warn( 'THREE.Audio: this Audio has no playback control.' );
            return;

        }

        this.source.stop();
        this.startTime = this.context.currentTime;
        this.isPlaying = false;

        return this;

    },

    stop: function () {

        if ( this.hasPlaybackControl === false ) {

            console.warn( 'THREE.Audio: this Audio has no playback control.' );
            return;

        }

        this.source.stop();
        this.startTime = 0;
        this.isPlaying = false;

        return this;

    },

    connect: function () {

        if ( this.filters.length > 0 ) {

            this.source.connect( this.filters[ 0 ] );

            for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

                this.filters[ i - 1 ].connect( this.filters[ i ] );

            }

            this.filters[ this.filters.length - 1 ].connect( this.getOutput() );

        } else {

            this.source.connect( this.getOutput() );

        }

        return this;

    },

    disconnect: function () {

        if ( this.filters.length > 0 ) {

            this.source.disconnect( this.filters[ 0 ] );

            for ( var i = 1, l = this.filters.length; i < l; i ++ ) {

                this.filters[ i - 1 ].disconnect( this.filters[ i ] );

            }

            this.filters[ this.filters.length - 1 ].disconnect( this.getOutput() );

        } else {

            this.source.disconnect( this.getOutput() );

        }

        return this;

    },

    getFilters: function () {

        return this.filters;

    },

    setFilters: function ( value ) {

        if ( ! value ) value = [];

        if ( this.isPlaying === true ) {

            this.disconnect();
            this.filters = value;
            this.connect();

        } else {

            this.filters = value;

        }

        return this;

    },

    getFilter: function () {

        return this.getFilters()[ 0 ];

    },

    setFilter: function ( filter ) {

        return this.setFilters( filter ? [ filter ] : [] );

    },

    setPlaybackRate: function ( value ) {

        if ( this.hasPlaybackControl === false ) {

            console.warn( 'THREE.Audio: this Audio has no playback control.' );
            return;

        }

        this.playbackRate = value;

        if ( this.isPlaying === true ) {

            this.source.playbackRate.setValueAtTime( this.playbackRate, this.context.currentTime );

        }

        return this;

    },

    getPlaybackRate: function () {

        return this.playbackRate;

    },

    onEnded: function () {

        this.isPlaying = false;

    },

    getLoop: function () {

        if ( this.hasPlaybackControl === false ) {

            console.warn( 'THREE.Audio: this Audio has no playback control.' );
            return false;

        }

        return this.loop;

    },

    setLoop: function ( value ) {

        if ( this.hasPlaybackControl === false ) {

            console.warn( 'THREE.Audio: this Audio has no playback control.' );
            return;

        }

        this.loop = value;

        if ( this.isPlaying === true ) {

            this.source.loop = this.loop;

        }

        return this;

    },

    getVolume: function () {

        return this.gain.gain.value;

    },


    setVolume: function ( value ) {

        this.gain.gain.value = value;

        return this;

    }

} );

export { Audio };
