// Custom page actions
;(function($, M){
  'use strict';
  var staatsschutzTheme_data = {
    id: 1,
    name: 'Stoppt das Staatsschutzgesetz!',
    info: {
      is_home: true,
      is_front_page: true,
      is_category: false,
      is_archive: false,
      is_page: true,
      is_singular: true
    }
  }
    
  window.staatsschutzTheme = function(){
    var resize = function resize(){
          var feature,
              featureName;

          /**
           * Resize all features
           */
          for ( featureName in staatsschutzTheme.features ) {
            if ( staatsschutzTheme.info['feature-' + featureName] ) {
              feature = staatsschutzTheme.features[featureName];

              feature.resize();
            }
          }
        },
        ready = function ready(){
          var feature,
              featureName;

          /**
           * Ready all features
           */
          for ( featureName in staatsschutzTheme.features ) {
            if ( staatsschutzTheme.info['feature-' + featureName] ) {
              feature = staatsschutzTheme.features[featureName];

              feature.ready();
            }
          }
        },
        setup = function setup(){
          var featureName,
              feature,
              featureOptions,
              dataName,
              dataValue,
              data = arguments[0];
              
          staatsschutzTheme.info = {};
          staatsschutzTheme.page = {};
          
          if ( $.isPlainObject(data) ) {
            for ( dataName in data ) {
              dataValue = dataName === 'id' ? parseInt(data[dataName]) : data[dataName];
              
              if ( dataName !== 'info') {
                staatsschutzTheme.page[dataName] = dataValue;
              }
            }
            if ( data.hasOwnProperty('info') ) {
              for ( dataName in data.info ) {
                staatsschutzTheme.info[dataName] = data.info[dataName];
              }
            }
          }
          
          $.log(data.info);
          
          /**
           * Loop through all features to set all neccessary data
           * ====================================================
           * After all their .ready() function will be executet and the nxr.info object gets updated.
           */
          for ( featureName in staatsschutzTheme.features ) {
            feature = staatsschutzTheme.features[featureName];
          
            /**
             * Make a copy of merged page feature options and feature options
             * jQuery.extend() will take care for a boolean value of options.page.features[featureName]
             */
            featureOptions = $.extend(true, {}, feature.options || {});

            /**
             * Merge the feature with common feature functions, options and info
             */
            $.extend(true, feature, {
              options: featureOptions,
              info: {
                name: featureName
              }
            });
            staatsschutzTheme.info['feature-' + featureName] = Boolean(feature.setup());
          }
          
          /**
           * Execute ready event
           */
          $(document).on('ready', function(){
            ready();
          });
    
          /**
           * Execute resize event
           */
          $(window).on('debouncedresize', function() {                
            resize();
          });
        };
    
    return {
      init: function init(){
        setup(arguments[0] || null);
      },
      is_page: function is_page(){
        var id = typeof arguments[0] !== 'undefined' ? parseInt(arguments[0]) : null;
        
        if ( id ) {
          return id === staatsschutzTheme.page.id;
        } else {
          return staatsschutzTheme.info.is_page;
        }
      }
    };
  }();
  
  staatsschutzTheme.features = {
  
    /**
     * equal heights for columns
     * =========================
     */
    equalHeights: {
      options: {
        disableOn: 600,
        selectors: {
          containers: '.articles',
          column: 'article > .inner'
        }
      },
      info: {},
      get_highest: function get_highest(container){
        var selectors = this.options.selectors,
            highest = 0;
        
        $(container).find(selectors.column).each(function(){
          var $column = $(this),
              columnHeight = parseInt($column.innerHeight());
          if ( columnHeight > highest ) {
            highest = columnHeight;
          }
        });
        
        return highest;
      },
      set_heights: function set_heights(container, height){  
        var selectors = this.options.selectors;
          
        $(container).find(selectors.column).each(function(){
          var $column = $(this),
              hasPadding = parseInt($column.css('padding-top')) > 0,
              finalHeight = height;
              
          if ( hasPadding ) {
            finalHeight = height - ( parseInt($column.css('padding-top')) + parseInt($column.css('padding-bottom')) );
          }
          $column.height(finalHeight);
        });
      },
      remove_heights: function remove_heights(container){
        var selectors = this.options.selectors;
        
        $(container).find(selectors.column).each(function(){
          $(this).removeAttr('style');
        });
      },
      equal_heights: function equal_heights(){
        var selectors = this.options.selectors,
            $columns = this.$containers.find(selectors.column),
            equalHeights = this;
            
        this.$containers.each(function(){   
          var $container = this;
          
          setTimeout(function(){
            var highest;
          
            equalHeights.remove_heights($container);
            highest = equalHeights.get_highest($container);
            equalHeights.set_heights($container, highest);
          }, 50);
        });
      },
      resize: function resize(){
        var disable = M.check_breakpoint(this.options.disableOn, true),
            equalHeights = this;
        
        if ( disable ) {
          this.$containers.each(function(){
            equalHeights.remove_heights(this);
          });
        } else {
          this.equal_heights();
        }
      },
      ready: function ready(){        
        this.$containers = $(this.options.selectors.containers);
        this.resize();
      },
      setup: function setup(){
        var isSetup = false; //staatsschutzTheme.info.is_front_page || staatsschutzTheme.info.is_home || staatsschutzTheme.is_page(18) || staatsschutzTheme.is_page(11);
        return isSetup;
      }
    },
  
    /**
     * Mobile burger menu
     * ==================
     */
    menu: {
      options: {
        disableOn: 1023,
        borderTreshold: 3,
        duration: 350,
        selectors: {
          nav: '#primary',
          menu: '#menu-primary',
          toggler: '#menu-toggle',
        },
        classNames: {
          enabled: 'app-menu',
          toggler: 'toggle',
          active: 'active'
        },
        texts: {
          toggle: 'Toggle Menu'
        }
      },
      info: {
        timeOut: null
      },
      set_menuHeight: function(){
        this.info.menuHeight = this.$menu.outerHeight() + this.options.borderTreshold;
      },
      enable: function () {
        var options = this.options,
            info = this.info,
            $body = this.$body,
            $toggler = this.$toggler;
            
        this.$menu.css({top:'-' + info.menuHeight + 'px'});
        
        $toggler.on({
          click: function(event){
            var $target = $($toggler.attr('href'));
                
            if ( $target.is('.' + options.classNames.active) ) {
              $target.css({top:'-' + info.menuHeight + 'px'});
              $toggler.removeClass(options.classNames.active);
              $target.removeClass(options.classNames.active).next().trigger('focus');
              $body.removeClass(info.name + '-' + options.classNames.active);

            } else {
              
              $toggler.addClass(options.classNames.active);              
              $target.css({top:'-' + options.borderTreshold +'px'});
              
              info.timeOut = setTimeout(function(){
                $target.addClass(options.classNames.active).find('a').eq(0).trigger('focus');
                $body.addClass(info.name + '-' + options.classNames.active);
              }, options.duration);
            }
            event.preventDefault();
          }
        });
        
        this.$nav.addClass(options.classNames.enabled);
        this.info.isActive = true;

      },
      disable: function () {
        var options = this.options;

        this.$toggler.off('click');
        this.$menu.find('a').off('click');
        //this.$menu.find('.sub-menu-parent-link').remove();
        this.$menu.removeAttr('style').removeClass('active');
        this.$menu.find('ul').removeAttr('style');
        this.$nav.removeClass(options.classNames.enabled);
        this.info.isActive = false;
      },
      resize: function resize(){
        var disable = M.check_breakpoint(this.options.disableOn);
        
        if ( disable ) {
          if ( this.info.isActive ) {
            this.disable();
          }
        } else {
          if ( !this.info.isActive ) {
            this.set_menuHeight();
            $.log(this.info.menuHeight);
            this.enable();
          }
        }
      },
      ready: function ready(){
        var options = this.options;

        this.$body = $('body');
        this.$nav = $(options.selectors.nav);
        this.$menu = $(options.selectors.menu);
        this.set_menuHeight();
        //this.$has_subMenu = this.$menu.find('.menu-item-has-children');
        this.$toggler = $(options.selectors.toggler).addClass(options.classNames.toggler).html(options.texts.toggle);
        
        this.resize();
      },
      setup: function setup(){
        return true;
      }
    },
    
  
    /**
     * accordion
     * =========
     */
    accordion: {
      options: {
        disableOn: 0,
        selectors: {
          content: 'article .content',
          heading: 'h3',
          accordion: {
            header: 'h3'
          }
        },
        classNames: {
          accordion: {
            base: 'acc',
            header: 'header',
            content: 'content',
            opened: 'opened',
            closed: 'closed'
          }
        }
      },
      info: {},
      open: function open($header, $content){
        $header.removeClass(cNaccClosed);
        $header.addClass(cNaccOpened);
        $content.stop().slideDown(speed);
      },
      close: function close($header, $content){
        $header.removeClass(cNaccOpened);
        $header.addClass(cNaccClosed);
        $content.stop().slideUp(speed);
      },
      init: function init(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            cNaccBase =  classNames.accordion.base + '-',
            cNaccHeader =  classNames.accordion.base + '-' + classNames.accordion.header,
            cNaccContent =  classNames.accordion.base + '-' + classNames.accordion.content,
            cNaccOpened =  classNames.accordion.base + '-' + classNames.accordion.opened,
            cNaccClosed =  classNames.accordion.base + '-' + classNames.accordion.closed,
            accordion = this;
      
        $(selectors.content).children(selectors.accordion.header).each(function(index){
          var $header = $(this).addClass(cNaccClosed).addClass(cNaccHeader),
              headerHtml = $header.html(),
              $accAnchor = $('<a href="#acc-' + index + '" />').html(headerHtml);
               
          $header.nextUntil(selectors.heading).wrapAll('<div class="' + cNaccContent + '" id="' + cNaccBase + index + '"/>');
          $header.empty().append($accAnchor);
          
          $accAnchor.on('click', function(event){
            var $content = $header.next('.' + cNaccContent);
            
            if ( $header.is('.' + cNaccOpened) ) {
              accordion.close($header, $content);
            } else {
              accordion.open($header, $content);
            }
            event.preventDefault();        
          });      
        });
      },
      resize: function resize(){
      },
      ready: function ready(){
        this.init();
      },
      setup: function setup(){
        return true;
      }
    }
  };
  
  /**
   * Support for JSON API Plugin
   * ===========================
   * @see https://wordpress.org/plugins/json-api/
   
  var siteData = $.getJSON(window.location.href + '?json=1');
  
  siteData.done(function(pageData){
    staatsschutzTheme.init(pageData);
  });
   */
  
  staatsschutzTheme.init(staatsschutzTheme_data);
    
})(jQuery, Modernizr);



