(function(M){
  M.addTest('mediaqueries', Modernizr.mq("only all"));
  M.addTest('placeholder', Modernizr.input.placeholder);
  
  /**
   * Detect if a browser is respond.js supported
   */
  M.addTest('mediaqueriesrespond', typeof respond !== 'undefined' && ( typeof respond.mediaQueriesSupported === 'undefined' || ( typeof respond.mediaQueriesSupported === 'boolean' && respond.mediaQueriesSupported === false ) ) );
    
  /**
   * Modernizr AddOn: "ViewportSize"
   *
   * get the width and height of the viewport.
   *
   * @ Usage Modernizr.viewportSize();
   *
   * @ Homepage: https://github.com/netzgestaltung/jquery.get_viewportSize/
   * @ Copyright 2015 nexxar/Thomas Fellinger
   * @ License GPLv2
   *
   * @return  {object}  size  object which contains width and height in numbers (pixels)
   */
  M.viewportSize = function viewportSize() {
    var size = {
      width: window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,
      height: window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight
    }
    return size;
  };

  /**
   * Modernizr AddOn: "Check Breakpoint"
   *
   * checks if the size of the viewport is narrower then a given number
   *
   * the check can be revertet by the second parameter(default: false)
   *
   * @usage   Modernizr.check_breakpoint(number);
   * @requires  Modernizr.mq()
   * @support
   *   respond.js for older browser (requires Modernizr.mediaqueriesrespond, Modernizr.viewport())
   *
   * @param   {number}   breakpoint  required  pixel value to check against
   * @param   {boolean}  reverse     optional  reverse the check from min-width to max-width
   * @return  {boolean}                        returns false if the media is narrower than the given breakpoint, otherwise true - revertet if the reverse param is given.
   */
  M.check_breakpoint = function check_breakpoint(){
    var breakpoint = typeof arguments[0] === 'number' ? arguments[0] : false,
        reverse = typeof arguments[1] === 'boolean' ? arguments[1] : false,
        viewportSize,
        check;

    /**
     * if no breakpoint is given or breackpoint is 0(zero), check will still be 'undefined'
     */
    if ( breakpoint ) {

      /**
       * Test if respond.js is active
       */
      if ( M.mediaqueriesrespond ) {

        /**
         * For IE 7/8
         */
        viewportSize = M.viewportSize();
        check = reverse ? viewportSize.width <= breakpoint : viewportSize.width >= breakpoint;
      } else {

        /**
         * For modern browsers
         */
        check = reverse ? M.mq('only all and (max-width: ' + breakpoint + 'px)') : M.mq('only all and (min-width: ' + breakpoint + 'px)');
      }
    }
    return check;
  };
})(Modernizr);
