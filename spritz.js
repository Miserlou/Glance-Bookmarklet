;(function ( $, window ) {
    var name = "openspritz";

    var defaults = {
        wpm: 200,
        nbrChars: 22
    };

    var _clearTimeout = function() {
      var id = window.setTimeout(function() {}, 0);
      while (id--) {
        window.clearTimeout(id);
      }   
    };

    var Spritz = function ( element, base, options ) {
      this._el = $(element);
      this._base = base;
      this._settings = $.extend( {}, defaults, options );
      this._name = name;
      this.init();
    };

    Spritz.prototype = {
      init: function () {
        var words = this._el.text().split(' ');
        var self = this;
        $.each( words, function( i, word ) {
          setTimeout( self.render.bind(self), (60000/self._settings.wpm) * i, word );
        });
      },

      pivot: function( word ) {
        var length = word.length,
            bit = -1;

        while( word.length < this._settings.nbrChars ) {
          word = bit > 0 ? word + '.' : '.' + word; 
          bit *= -1;
        }

      var start = word.slice( 0, word.length/2 ),
          end = word.slice( word.length/2, word.length ),
          first = $( '<span></span>' ).attr( 'class', 'start' ).text( start.slice( 0, start.length -1 ) ),
          middle = $('<span></span>').attr('class', 'pivot').text( start.slice( start.length - 1 ) ),
          last = $('<span></span>').attr('class', 'end').text(end);

      return first.append(middle).append(last);

      },
      
      render: function( word ) {
        var p = this.pivot( word );
        if(p === '' || p === '\n' || p === ' ') {
          return; 
        }
        this._base.html(p);
      },

        setWpm: function(wpm) {
          _clearTimeout();
          this._settings.wpm = wpm;   
          this.init();
        }
    };

    $.fn[name] = function ( options ) {
      return this.each(function() {
        if( !$.data( this, "plugin_" + name) ) {
          $.data( this, "plugin_" + name, new Spritz( this, options) );
        }
      });
    };
}( jQuery, window ));