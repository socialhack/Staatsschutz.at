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
        disableOn: 600,
        selectors: {
          nav: '#menuBar',
          menu: '#menu-main',
          toggler: '#menu-toggle',
        },
        classNames: {
          togglerClass: 'toggle',
          activeClass: 'active'
        },
        texts: {
          toggleText: 'Toggle Menu'
        }
      },
      info: {},
      enable: function () {
        var options = this.options,
            currentScrollTop = $('html').scrollTop(),
            oldScrollTop = 0;

        this.$menu = $(options.selectors.menu);
        this.$has_subMenu = this.$menu.find('.menu-item-has-children');
        this.$toggler = $('<a href="' + options.selectors.menu + '" id="' + options.selectors.toggler.replace('#', '') + '" class="' + options.classNames.togglerClass + '">' + options.texts.toggleText + '</a>');

        this.$toggler.on({
          click: function(event){
            var $toggler = $(this),
                $header = $toggler.parents('header').eq(0),
                $target = $($toggler.attr('href'));

            if ( $target.is('.' + options.classNames.activeClass) ) {
              $toggler.removeClass(options.classNames.activeClass);
              $target.removeClass(options.classNames.activeClass).next().trigger('focus');
              $header.removeClass('menu-' + options.classNames.activeClass);

              if ( currentScrollTop !== oldScrollTop ) {
                $('html, body').animate({scrollTop:oldScrollTop}, '300', function(){
                  currentScrollTop = oldScrollTop;
                });
              }

            } else {
              $toggler.addClass(options.classNames.activeClass);
              $target.addClass(options.classNames.activeClass).find('a').eq(0).trigger('focus');
              oldScrollTop = $('html').scrollTop();;
              currentScrollTop = 0
              $('html, body').animate({scrollTop:currentScrollTop}, '300', function(){
                $header.addClass('menu-' + options.classNames.activeClass);
              });
            }
            event.preventDefault();
          }
        });

        this.$menu.before(this.$toggler);

        this.$subMenus = this.$has_subMenu.each(function(){ return $(this).children('ul')});

        this.$has_subMenu.children('ul').each(function(){
          var $subMenu = $(this),
              toggle_subMenu = function toggle_subMenu($newActiveSubMenuParent){
                $newActiveSubMenuParent.toggleClass('toggled-' + options.classNames.activeClass);
                $newActiveSubMenuParent.children('ul').slideToggle();
              };

          $subMenu.hide().prepend($('<li class="sub-menu-parent-link" />').prepend($subMenu.prev('a').clone())).prev('a').on({
            click: function click(event){
              var $newActiveSubMenuParent = $(this).parent('li'),
                  $activeSubMenuParent = $newActiveSubMenuParent.siblings('.toggled-' + options.classNames.activeClass);

              if ( $activeSubMenuParent.length > 0 ) {
                toggle_subMenu($activeSubMenuParent)
              }
              toggle_subMenu($newActiveSubMenuParent);

              event.preventDefault();
            }
          });
        });
        
        this.info.isActive = true;

      },
      disable: function () {
        var options = this.options;

        this.$toggler.off('click').remove();
        this.$menu.find('a').off('click');
        this.$menu.find('.sub-menu-parent-link').remove();
        this.$menu.removeAttr('style').removeClass('active');
        this.$menu.find('ul').removeAttr('style');
        this.info.isActive = false;
      },
      resize: function resize(){
        var disable = M.touch ? false : M.check_breakpoint(this.options.disableOn);
        $.log(M.touch);
        $.log(disable);
        if ( disable ) {
          if ( this.info.isActive ) {
            this.disable();
          }
        } else {
          if ( !this.info.isActive ) {
            this.enable();
          }
        }
      },
      ready: function ready(){
        this.resize();
      },
      setup: function setup(){
        return true;
      }
    },
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



