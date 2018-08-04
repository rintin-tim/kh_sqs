<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>

    <script>
        console.log("script started");
        window.addEventListener('load', function() {
    
        // window.onload = function() {

    		console.log("start onload function");

            trimDiv();
    		runObserver();
            equalizeHeight();
            // $( document ).ready( function() { equalizeHeight(); });
            window.onresize = function() { trimDiv(); };
    		//window.addEventListener('resize', trimDiv);  // consider change for onresize
    		console.log("finish onload function");

        });

        function equalizeHeight() {
            /** for use on the Overview page. Function equalizes the height of the images next to each other. Use jquery plugin: matchHeight 
            https://github.com/liabru/jquery-match-height/blob/master/README.md#usage */
            
            var testOverviewPage = document.getElementById('collection-5b53a8a6575d1f8f7ce0d584') 
            var overviewPage = document.getElementById('collection-5a526ba10d9297f9a596a5cb')
            console.log('testOverviewPage element result: ' + testOverviewPage)
            console.log('overviewPage element result: ' + overviewPage)
            if (testOverviewPage || overviewPage) { $('.image-block-wrapper').matchHeight();
                console.log('equalise baby');
            }
        }           


        function updateBannerScroll() {

            /** maintains the overflow scroll positon when the viewport size 
            changes (e.g. portrait to landscape)
            */
           
           /** store the leftScroll position */
            var scrollPosition = 0

            /** set tolerance */
            var tolerance = 100;

            var viewportWidth = window.innerWidth

            // overflow page element
            var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];
            
            if (galleryStrip && (viewportWidth < 1024) ) {
                /** listen for any scroll event and run function. but only on mobile. */
                console.log('screen is smaller than 1024')
                galleryStrip.onscroll = function() { scrollLog(galleryStrip); };
            }
       
            function scrollLog(galleryStrip) {

                /** if there's a large jump, restore the previous scrollPosition, otherwise update the scroll position */

                console.log('start scrollLog function')
                element = galleryStrip
                console.log('current scrollPosition is: ' + scrollPosition)
                console.log('current scrollLeft is: ' + element.scrollLeft)
                var stored = scrollPosition
                var current = element.scrollLeft
                
                if (((stored  - current) > tolerance ) && (current < tolerance)) {
                    console.log('large jump. resetting scrollLeft to: ' + scrollPosition)
                    element.scrollLeft = scrollPosition;
                } else {
                    console.log('within tolerance. scrollPosition updated to: ' + current)
                    scrollPosition = current;
                }

            }
        }
     

        function insertCaption(nextLeftArray, captionNames) {

            /** used on the portrait page to insert caption below image. parameters - an list of widths (nextLeftArray) and list of captions.
            Each caption is inserted in the document from the left margin according to the next corresponding LeftArray value. The distances 
            are calculated by the trimDiv function  */

            // debouncer

            captionAction = false;

            console.log('insertCaption fired')
            delay = 250

            clearTimeout(captionAction)

            captionAction = setTimeout(function() {
                internalInsertCaption(nextLeftArray, captionNames);

            }, delay)

            function internalInsertCaption(nextLeftArray, captionNames) {

                console.log('insertCaption running')
                captionArray = captionNames // list of captions
                nextLeftArray.unshift(0) // insert a zero to be the first position 
                nextLeftArray.pop(); // and remove the last value because this is the distance to the end of the last image 
                nextLeftArray.forEach( function(item, index) {
                    var extra = 2
                    item = item + (extra * index)
                });  // add extra pixels to each item in the list to accomodate the gap between images
            
                // console.log(nextLeftArray)

                // images are inserted multiple times per page load - remove old captions before re-inserting each time.
                var sqsWrapperOld = document.getElementsByClassName("sqs-wrapper")[0];  // wrapper
                oldCaptions = document.querySelectorAll("div.sqs-wrapper div"); // captions to be removed
            
                console.log("old captions: " + oldCaptions.length)
                oldCaptions.forEach(function(item, index) {
                sqsWrapperOld.removeChild(oldCaptions[index]);
                });
             
                // for item in nextLeftArray, insert the next caption at the corresponding position 
                var array = nextLeftArray;
                
                array.forEach(function(item, index) {
               	    var sqsWrapper = document.getElementsByClassName("sqs-wrapper")[0]; // get wrapper. captions overlap briefly if wrapper is placed outside of loop.
                    var newDiv = document.createElement("div");
                    var content = document.createTextNode(captionArray[index]);

                    // create needed css directly in html
                    var styleAttribute = document.createAttribute("style");
                    styleAttribute.value = "position: absolute; z-index: 1; float: left; left: " + item + "px; bottom: -3px; padding-left: 5px;"  

                    // insert into page    
                    newDiv.setAttributeNode(styleAttribute); // add style to new div
                    newDiv.appendChild(content); // add text to new div
                    sqsWrapper.appendChild(newDiv); // add new div to wrapper

                });
            }
        }

        function trimDiv() {

            /** 
            1. calculates the width of images in the gallery in order to ascertain: 
                1a. the max length of the wrapper element, which Squarespace is over extending 
                1b. the insertion points for captions on the gallery page
            2. trims the max length of the wrapper element according to above (needed particulalry for mobile)
            3. gathers the alt tags for all gallery images into a list - these are then used as captions by the insertCaption function
            4. triggers the above insert caption function
            5. adds fade class to image borders
            5. prevents clicking on the last image in the carousel as this causes the length of a trimmed wrapper to go crazy 
             */

            console.log("trim div kicked in");
            var homePage = document.getElementById("collection-5ac681c4aa4a99b176337f89") 
            var portraitPage = document.getElementById("collection-5a52a4c753450aea1728c820")  

            // skip function if on the homepage
            if (!homePage) {

                var imgs = document.getElementsByClassName("sqs-gallery-design-strip-slide");  // images within overflow element
                
                // check images are loaded before continuing 
                if (imgs.length > 0) {

                	var nextLeftArray = []  // list of image widths
                    var captionNames = []  // list of caption names

                    var widthTotal = 34; // // add up the total width of all images. includes value for margin on the left and right of screen 
                    var testWidth = 0

                    for (var i = 0; i < imgs.length; i++) {
                        // calculate the width of each gallery image 
                        imgWidth = imgs[i].clientWidth;
                        
                        // add the widths to a running total
                        widthTotal += imgWidth;
                        testWidth += imgWidth;
                        // console.log(imgs[i].clientWidth);
                        // console.log("total: " + widthTotal);
                        widthTotal += 12; // gap between images 
                        
                        // add captions to list
                        capName = imgs[i].getAttribute("alt")
                        captionNames.push(capName)

                        // add widths to list
                        nextLeftArray.push(widthTotal-34) // add to array but compensate for page margin
                        // console.log("with margin total: " + widthTotal);

                        console.log('testWidth is: ' + testWidth)

                        console.log('calculating img.clientWidth and adding widthTotal')
                        
                        // adds fade class used by the CSS for border transition animation
                        imgs[i].classList.add("border-fade");
                    
                    }
                    
                    //console.log("innerWidth: " + window.innerWidth)            
                    
                    // set max width of element to the sum of its images within it (plus margins, etc) 
                    var elem = document.getElementsByClassName("sqs-wrapper")[0];
                    
                    console.log("setting new maxWidth: " + widthTotal + "px")
                    elem.style.maxWidth = "" + widthTotal + "px";

    //                console.log(nextLeftArray)

                    var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];

                    // identify the last image in the carousel clicked and add identifying class     
                    var lastImage = imgs[imgs.length - 1];  // find last image
                    var secondLastImage = imgs[imgs.length - 2];


                    // REMOEMBER THIS 
                    // if (portraitPage) {
                    //     secondLastImage.addEventListener("click", resetWrapper, true);
                    //     lastImage.addEventListener("click", resetWrapper, true);
                    // }

                    // added
                    if (portraitPage) {
                        secondLastImage.addEventListener("click", lastImageVisible, true );
                        lastImage.addEventListener("click", lastImageVisible, true );
                    }
                    
                    var resetFlag = false;
                    console.log('resetFlag 0: ' + resetFlag)

                    // TODO - add this function into resetWrapper
                    function isScrolledIntoView(el) {
                        var rect = el.getBoundingClientRect();
                        var elemTop = rect.top;
                        var elemBottom = rect.bottom;

                        // Only completely visible elements return true:
                        var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
                        // Partially visible elements return true:
                        //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
                        return isVisible;
                    }
        
                    function resetWrapper(event) {
                        console.log('running resetWrapper')
                        var firstCaptionDiv = document.querySelector('div.sqs-wrapper>div')
                        //debugger;                        
                        if (resetFlag && (lastImage.classList.contains('sqs-active-slide') || firstCaptionDiv.classList.contains('sqs-active-slide'))) {
                            console.log('resetFlag 1: ' + resetFlag)
                            console.log('resetFlag 1: detaching listener from lastimage...')
                            Y.detach("click", "undefined", lastImage);
                            console.log('stopPropagation and preventDefault...')
                            console.log(event.type)
                            event.stopPropagation();
                            event.preventDefault();
                            console.log('seting wrapper to 0...')
                            elem.style.left = 0;
                            console.log('seting scrollLeft to 0...')
                            galleryStrip.scrollLeft = 0;
                            console.log('wrapper left is: ' + elem.style.left + ' scrollLeft is: ' + galleryStrip.scrollLeft)
                            resetFlag = false;
                            console.log('resetFlag 2: ' + resetFlag)
                        } else if (lastImage.classList.contains('sqs-active-slide') || secondLastImage.classList.contains('sqs-active-slide' ) && !resetFlag) { 
                            console.log('resetFlag 3: ' + resetFlag)
                            // console.log('resetFlag 3: detaching click listener')
                            // Y.detach("click", "undefined", lastImage);
                            resetFlag = true;
                            console.log('resetFlag 4: ' + resetFlag)
                        } else {
                            console.log('do nothing: lastImage contains sqs-active-slide is: ' + lastImage.classList.contains('sqs-active-slide') + ' resetFlag is: ' + resetFlag)
                        }
                    }

                    var visibleFlag = false

                    function lastImageVisible(ev) {

                        console.log('running lastImageVisible')

                        if (!visibleFlag) {

                            setTimeout(internalImageVisible(ev), 250)

                            function internalImageVisible(ev) {

                                console.log('running internalImageVisible')

                                rect = lastImage.getBoundingClientRect();    
                                lastImagePosition = rect.x;
                                viewport = window.innerWidth;
                                lastImageWidth = rect.width;

                                visibleBuffer = 10  // an estimate to accomodate the page margins left and right

                                fullyVisiblePoint = (viewport - lastImageWidth) - visibleBuffer // x value at which the last image would be fully visible

                                //debugger;

                                if (fullyVisiblePoint > lastImagePosition) {
                                    console.log('last image IS fully visible')
                                    console.log('fullyVisiblePoint: ' + fullyVisiblePoint + 'lastImagePosition: ' + lastImagePosition)
                                    visibleFlag = true;
                                    Y.detach("click", "undefined", lastImage);
                                } else {
                                    // if it's the last image use new function and detach, else just change visible flag as before
                                    //debugger;
                                    console.log('event.target is: ' + ev.target)
                                    if (ev.target == lastImage) {
                                        Y.detach("click", "undefined", lastImage);
                                        // insert new function
                                        // calculate the amount to move the image along evertything visible and then remove that amount from the left margin
                                        imageDelta = lastImagePosition - fullyVisiblePoint;  // how many pixels to get the last image visible
                                        // get the current left value and add the image delta
                                        if (imageDelta > 0) { 
                                            currentLeft = parseFloat(elem.style.left, 10);
                                            var finalLeftMargin = currentLeft - imageDelta;  // remove the imageDelta from the curren left margin to nudge the last image fully into view
                                            elem.style.left = finalLeftMargin + 'px';   
                                            visibleFlag = true;
                                        }
                                    } else {
                                        console.log('last image NOT fully visible')
                                        console.log('fullyVisiblePoint: ' + fullyVisiblePoint + 'lastImagePosition: ' + lastImagePosition)
                                        visibleFlag = false
                                    }
                                }
                            }
                        } else { 
                            console.log('stopPropagation and preventDefault...')
                            console.log(event.type)
                            event.stopPropagation();
                            event.preventDefault();
                            console.log('seting wrapper to 0...')
                            elem.style.left = 0;   
                            visibleFlag = false
                        }

                    }

                    //  if canno

                    

                    
     
                    // removed
                    // lastImage.classList.add("last-image")  // in order to apply 'pointer: none' in css. pointer:none is on portrait page only in css

                    // var imgConfig = { attributes: true, childList: false, subtree: false, attributeFilter: 'class' };

                    // var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];



                    function imageNudgeObserver(nudgePixels) {

                        /** when the last image is active, nudge to the right to ensure it's fully visible using scrollLeft
                        when the last image is not active, remove the nudge  */
                        var nudge = nudgePixels  // in pixels
                        var imgObserver = new MutationObserver(function(mutation) {
                        console.log('running imageNudgeObserver')
                        // TODO add to on-click listener?    
                        if (lastImage.classList.contains('sqs-active-slide')) {
                            console.log('adding nudge. scrollLeft is: ' + galleryStrip.scrollLeft)
                            /** debouncer for observer */
                            console.log('hang on for debounce')
                           setTimeout(function() {                         
                               galleryStrip.scrollLeft = nudge;
                               console.log('debounce cleared scrollLeft is now ' + galleryStrip.scrollLeft)
                           }, 250) 
                               
                            } else {
                                console.log('resetting scrollLeft to 0')
                               galleryStrip.scrollLeft = 0
                            }
                        })

                    console.log('last image: ' + typeof lastImage)
                    //debugger;

                    imgObserver.observe(lastImage, { attributes: true, subtree: false, attributeFilter: ['class'] } )

                    }


                    /** functions to run depending upon portrait page status */

                   
                    // if portrait page - run these functions
                    
                    if (portraitPage) {
                        insertCaption(nextLeftArray, captionNames)  // insert the captions on the portrait page
                        console.log('running portrait mode')
                       // imageNudgeObserver(80) // nudge on portrait
                    } 

                    // if not portrait page - run these functions

                    if (!portraitPage) {
                        console.log('running not portrait mode')
                        imageNudgeObserver(100) // nudge if not on the portrait page 
                    }
                } 
            } else { 
                console.log('cancel out - on the homepage');  // else clause can be removed
                }
        };


        function runObserver() {
            /** 
            This function uses a mutation observer to detect changes in the data-image-resolution attribute on the banner. 
            There are only a few DOM elements 
            that fire on each page. 
            This functions is responsible for firing trimDiv and updateBannerScroll each time a new page is opened  
            */

            console.log("start function runObserver");

            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

            var element = document.querySelector('#content'); // ouer wrapper used 

            // var observerCount = 0  // TBC counts number of times mutation obeserver has run
            // var myTimestamp = 0

            var actions = false // placeholder value for action in the MutationObserver

            var observer = new MutationObserver(function(mutations) {
                console.log("start new observer");
                console.log("mutations length :" + mutations.length);
                
                // trimDiv();
                // updateBannerScroll();

                // debouncing - ensures functions aren't called unnecessarily. These functions execute when another mutation isn't triggered within  the delay (250 ms) 
                var delay = 400
    
                clearTimeout(actions)

                actions = setTimeout(function() {
                            console.log('ok doing something now')
                            trimDiv();
                            updateBannerScroll();
                            equalizeHeight();
                            }, delay);


            });

            // run observer with below parameters
            observer.observe(element, {
                attributes: true,
                subtree: true,
                attributeFilter: ['data-image-resolution'] //listen for changes to this specific attribute only
            });

        }

        console.log("script finished");

    </script>



<script type="text/javascript">
  
/**
* jquery-match-height master by @liabru
* http://brm.io/jquery-match-height/
* License: MIT
*/

;(function(factory) { // eslint-disable-line no-extra-semi
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Global
        factory(jQuery);
    }
})(function($) {
    /*
    *  internal
    */

    var _previousResizeWidth = -1,
        _updateTimeout = -1;

    /*
    *  _parse
    *  value parse utility function
    */

    var _parse = function(value) {
        // parse value and convert NaN to 0
        return parseFloat(value) || 0;
    };

    /*
    *  _rows
    *  utility function returns array of jQuery selections representing each row
    *  (as displayed after float wrapping applied by browser)
    */

    var _rows = function(elements) {
        var tolerance = 1,
            $elements = $(elements),
            lastTop = null,
            rows = [];

        // group elements by their top position
        $elements.each(function(){
            var $that = $(this),
                top = $that.offset().top - _parse($that.css('margin-top')),
                lastRow = rows.length > 0 ? rows[rows.length - 1] : null;

            if (lastRow === null) {
                // first item on the row, so just push it
                rows.push($that);
            } else {
                // if the row top is the same, add to the row group
                if (Math.floor(Math.abs(lastTop - top)) <= tolerance) {
                    rows[rows.length - 1] = lastRow.add($that);
                } else {
                    // otherwise start a new row group
                    rows.push($that);
                }
            }

            // keep track of the last row top
            lastTop = top;
        });

        return rows;
    };

    /*
    *  _parseOptions
    *  handle plugin options
    */

    var _parseOptions = function(options) {
        var opts = {
            byRow: true,
            property: 'height',
            target: null,
            remove: false
        };

        if (typeof options === 'object') {
            return $.extend(opts, options);
        }

        if (typeof options === 'boolean') {
            opts.byRow = options;
        } else if (options === 'remove') {
            opts.remove = true;
        }

        return opts;
    };

    /*
    *  matchHeight
    *  plugin definition
    */

    var matchHeight = $.fn.matchHeight = function(options) {
        var opts = _parseOptions(options);

        // handle remove
        if (opts.remove) {
            var that = this;

            // remove fixed height from all selected elements
            this.css(opts.property, '');

            // remove selected elements from all groups
            $.each(matchHeight._groups, function(key, group) {
                group.elements = group.elements.not(that);
            });

            // TODO: cleanup empty groups

            return this;
        }

        if (this.length <= 1 && !opts.target) {
            return this;
        }

        // keep track of this group so we can re-apply later on load and resize events
        matchHeight._groups.push({
            elements: this,
            options: opts
        });

        // match each element's height to the tallest element in the selection
        matchHeight._apply(this, opts);

        return this;
    };

    /*
    *  plugin global options
    */

    matchHeight.version = 'master';
    matchHeight._groups = [];
    matchHeight._throttle = 80;
    matchHeight._maintainScroll = false;
    matchHeight._beforeUpdate = null;
    matchHeight._afterUpdate = null;
    matchHeight._rows = _rows;
    matchHeight._parse = _parse;
    matchHeight._parseOptions = _parseOptions;

    /*
    *  matchHeight._apply
    *  apply matchHeight to given elements
    */

    matchHeight._apply = function(elements, options) {
        var opts = _parseOptions(options),
            $elements = $(elements),
            rows = [$elements];

        // take note of scroll position
        var scrollTop = $(window).scrollTop(),
            htmlHeight = $('html').outerHeight(true);

        // get hidden parents
        var $hiddenParents = $elements.parents().filter(':hidden');

        // cache the original inline style
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.data('style-cache', $that.attr('style'));
        });

        // temporarily must force hidden parents visible
        $hiddenParents.css('display', 'block');

        // get rows if using byRow, otherwise assume one row
        if (opts.byRow && !opts.target) {

            // must first force an arbitrary equal height so floating elements break evenly
            $elements.each(function() {
                var $that = $(this),
                    display = $that.css('display');

                // temporarily force a usable display value
                if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
                    display = 'block';
                }

                // cache the original inline style
                $that.data('style-cache', $that.attr('style'));

                $that.css({
                    'display': display,
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-top': '0',
                    'margin-bottom': '0',
                    'border-top-width': '0',
                    'border-bottom-width': '0',
                    'height': '100px',
                    'overflow': 'hidden'
                });
            });

            // get the array of rows (based on element top position)
            rows = _rows($elements);

            // revert original inline styles
            $elements.each(function() {
                var $that = $(this);
                $that.attr('style', $that.data('style-cache') || '');
            });
        }

        $.each(rows, function(key, row) {
            var $row = $(row),
                targetHeight = 0;

            if (!opts.target) {
                // skip apply to rows with only one item
                if (opts.byRow && $row.length <= 1) {
                    $row.css(opts.property, '');
                    return;
                }

                // iterate the row and find the max height
                $row.each(function(){
                    var $that = $(this),
                        style = $that.attr('style'),
                        display = $that.css('display');

                    // temporarily force a usable display value
                    if (display !== 'inline-block' && display !== 'flex' && display !== 'inline-flex') {
                        display = 'block';
                    }

                    // ensure we get the correct actual height (and not a previously set height value)
                    var css = { 'display': display };
                    css[opts.property] = '';
                    $that.css(css);

                    // find the max height (including padding, but not margin)
                    if ($that.outerHeight(false) > targetHeight) {
                        targetHeight = $that.outerHeight(false);
                    }

                    // revert styles
                    if (style) {
                        $that.attr('style', style);
                    } else {
                        $that.css('display', '');
                    }
                });
            } else {
                // if target set, use the height of the target element
                targetHeight = opts.target.outerHeight(false);
            }

            // iterate the row and apply the height to all elements
            $row.each(function(){
                var $that = $(this),
                    verticalPadding = 0;

                // don't apply to a target
                if (opts.target && $that.is(opts.target)) {
                    return;
                }

                // handle padding and border correctly (required when not using border-box)
                if ($that.css('box-sizing') !== 'border-box') {
                    verticalPadding += _parse($that.css('border-top-width')) + _parse($that.css('border-bottom-width'));
                    verticalPadding += _parse($that.css('padding-top')) + _parse($that.css('padding-bottom'));
                }

                // set the height (accounting for padding and border)
                $that.css(opts.property, (targetHeight - verticalPadding) + 'px');
            });
        });

        // revert hidden parents
        $hiddenParents.each(function() {
            var $that = $(this);
            $that.attr('style', $that.data('style-cache') || null);
        });

        // restore scroll position if enabled
        if (matchHeight._maintainScroll) {
            $(window).scrollTop((scrollTop / htmlHeight) * $('html').outerHeight(true));
        }

        return this;
    };

    /*
    *  matchHeight._applyDataApi
    *  applies matchHeight to all elements with a data-match-height attribute
    */

    matchHeight._applyDataApi = function() {
        var groups = {};

        // generate groups by their groupId set by elements using data-match-height
        $('[data-match-height], [data-mh]').each(function() {
            var $this = $(this),
                groupId = $this.attr('data-mh') || $this.attr('data-match-height');

            if (groupId in groups) {
                groups[groupId] = groups[groupId].add($this);
            } else {
                groups[groupId] = $this;
            }
        });

        // apply matchHeight to each group
        $.each(groups, function() {
            this.matchHeight(true);
        });
    };

    /*
    *  matchHeight._update
    *  updates matchHeight on all current groups with their correct options
    */

    var _update = function(event) {
        if (matchHeight._beforeUpdate) {
            matchHeight._beforeUpdate(event, matchHeight._groups);
        }

        $.each(matchHeight._groups, function() {
            matchHeight._apply(this.elements, this.options);
        });

        if (matchHeight._afterUpdate) {
            matchHeight._afterUpdate(event, matchHeight._groups);
        }
    };

    matchHeight._update = function(throttle, event) {
        // prevent update if fired from a resize event
        // where the viewport width hasn't actually changed
        // fixes an event looping bug in IE8
        if (event && event.type === 'resize') {
            var windowWidth = $(window).width();
            if (windowWidth === _previousResizeWidth) {
                return;
            }
            _previousResizeWidth = windowWidth;
        }

        // throttle updates
        if (!throttle) {
            _update(event);
        } else if (_updateTimeout === -1) {
            _updateTimeout = setTimeout(function() {
                _update(event);
                _updateTimeout = -1;
            }, matchHeight._throttle);
        }
    };

    /*
    *  bind events
    */

    // apply on DOM ready event
    $(matchHeight._applyDataApi);

    // use on or bind where supported
    var on = $.fn.on ? 'on' : 'bind';

    // update heights on load and resize events
    $(window)[on]('load', function(event) {
        matchHeight._update(false, event);
    });

    // throttled update heights on resize events
    $(window)[on]('resize orientationchange', function(event) {
        matchHeight._update(true, event);
    });

});
  
</script>
