<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.2/jquery.matchHeight-min.js"></script>

<script>
    window.addEventListener('load', function() {

        // console.log("start onload function");

        trimDiv(); // potentially debounce trimDiv  runObserver();
        runObserver();
        equalizeHeight();
        updateCopyright();
        ajaxObserver();
        window.onresize = function() {
            trimDiv();
            runObserver();
            ajaxObserver();
        };

        // console.log("finish onload function");
    });

    function updateCopyright() {
        var year = new Date().getFullYear();
        var copyText = "Copyright \u00A9 Katie Hyams " + year;
        $('footer p').text(copyText);
    }


    function equalizeHeight() {
        /** for use on the Overview page. Function equalizes the height of the images next to each other. Use jquery plugin: matchHeight
        https://github.com/liabru/jquery-match-height/blob/master/README.md#usage */


        var overviewPage = document.getElementById('collection-5a526ba10d9297f9a596a5cb')
        if (overviewPage) {
            $('.image-block-wrapper').matchHeight();
            // console.log('equalising');
        }
    }


    function updateBannerScroll() {

        /** maintains the overflow scroll positon when the viewport size
        changes (e.g. portrait to landscape)
        */

        /** store the leftScroll position */
        var scrollPosition = 0

        // set cancel reset flag
        var cancelReset = false // if this is true it's because we've detected the banner has momentum (is still moving) and should not be reset

        /** set tolerance */
        var tolerance = 100;

        var viewportWidth = window.innerWidth

        // overflow page element
        var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];

        if (galleryStrip && (viewportWidth < 1025)) {
            /** listen for any scroll event and run function. but only on mobile. */
            // console.log('screen is smaller than 1025')
            galleryStrip.onscroll = function() {
                scrollLog(galleryStrip);
            };
        }


        function scrollLog(galleryStrip) {

            /** if there's a large jump, restore the previous scrollPosition, otherwise update the scroll position */

            element = galleryStrip
            // console.log('current scrollPosition is: ' + scrollPosition)
            // console.log('current scrollLeft is: ' + element.scrollLeft)
            var stored = scrollPosition
            var current = element.scrollLeft

            if (((stored - current) > tolerance) && (current < tolerance)) {
                // console.log(' stored: ' + stored + ' current: ' + current + ' stored - current = ' + (stored - current))
                // console.log(' part1: ' + ((stored  - current) > tolerance ) + ' part2: ' + (current < tolerance))
                // console.log('large jump. resetting scrollLeft to: ' + scrollPosition)

                setTimeout(function() {
                    /** wait 3 milliseconds for a change befre executing */
                    updatedScroll = element.scrollLeft
                    // console.log('old updated scroll (aka current) is '+ current +'new updated scroll is: ' + updatedScroll)
                    if ((current == updatedScroll) && !cancelReset) {
                        console.log('resetting to scrollPosition: ' + scrollPosition)
                        element.scrollLeft = scrollPosition;
                    } else {
                        // console.log('skipping over')
                        cancelReset = true
                        scrollPosition = current;
                    }

                }, 2)

            } else if (((stored - current) > tolerance) && (current > tolerance)) {
                // try resetting as per normal
                // console.log(' stored: ' + stored + ' current: ' + current + ' stored - current = ' + (stored - current))
                // console.log('not to the beginning but large jump. current scrollPosition: ' + scrollPosition)

                setTimeout(function() {
                    updatedScroll = element.scrollLeft
                    // console.log('old updated scroll (aka current) is '+ current +'new updated scroll is: ' + updatedScroll)
                    if ((current == updatedScroll) && !cancelReset) {
                        // console.log('resetting to scrollPosition: ' + scrollPosition)
                        element.scrollLeft = scrollPosition;
                    } else {
                        // console.log('skipping over')
                        cancelReset = true
                        scrollPosition = current;
                    }

                }, 2)

            } else {
                // console.log('in the else')
                // console.log(' stored: ' + stored + ' current: ' + current + ' stored - current = ' + (stored - current))
                // console.log(' part1: ' + ((stored  - current) > tolerance ) + ' part2: ' + (current < tolerance))
                // console.log('within tolerance. scrollPosition updated to: ' + current)
                scrollPosition = current;
                cancelReset = false

            }

        }
    }


    function insertCaption(nextLeftArray, captionNames) {

        /** used on the portrait page to insert caption below image. parameters - an list of widths (nextLeftArray) and list of captions.
        Each caption is inserted in the document from the left margin according to the next corresponding LeftArray value. The distances
        are calculated by the trimDiv function  */


        captionAction = false;

        // console.log('insertCaption fired')
        delay = 250

        clearTimeout(captionAction)

        captionAction = setTimeout(function() {
            internalInsertCaption(nextLeftArray, captionNames);

        }, delay)

        function internalInsertCaption(nextLeftArray, captionNames) {

            // console.log('insertCaption running')
            captionArray = captionNames // list of captions
            nextLeftArray.unshift(0) // insert a zero to be the first position
            nextLeftArray.pop(); // and remove the last value because this is the distance to the end of the last image
            nextLeftArray.forEach(function(item, index) {
                var extra = 2
                item = item + (extra * index)
            }); // add extra pixels to each item in the list to accomodate the gap between images


            // images are inserted multiple times per page load - remove old captions before re-inserting each time.
            var sqsWrapperOld = document.getElementsByClassName("sqs-wrapper")[0]; // wrapper
            oldCaptions = document.querySelectorAll("div.sqs-wrapper div"); // captions to be removed

            // console.log("old captions: " + oldCaptions.length)
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

            // sometimes the nudge is overzealous and kicks in on the initial page load - this corrects it
            // console.log("setting scroll to zero after captions");
            // var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];
            // nudgeBannerAlong(0)
            // galleryStrip.scrollLeft = 0

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
        6. prevents clicking on the last image in the carousel as this causes the length of a trimmed wrapper to go crazy
        7. probably does other stuff too

         */

        // console.log("trim div initialised");
        var homePage = document.getElementById("collection-5ac681c4aa4a99b176337f89")
        var portraitPage = document.getElementById("collection-5a52a4c753450aea1728c820")


        // skip function if on the homepage
        if (!homePage) {
            // console.log("trim div running");

            var imgs = document.getElementsByClassName("sqs-gallery-design-strip-slide"); // images within overflow element

            // check images are loaded before continuing
            if (imgs.length > 0) {
                // console.log("images are present");

                var nextLeftArray = [] // list of image widths
                var captionNames = [] // list of caption names

                var widthTotal = 34; // // add up the total width of all images. includes value for margin on the left and right of screen
                var testWidth = 0

                for (var i = 0; i < imgs.length; i++) {
                    // calculate the width of each gallery image
                    imgWidth = imgs[i].clientWidth;

                    // add the widths to a running total
                    widthTotal += imgWidth;
                    testWidth += imgWidth;

                    widthTotal += 12; // gap between images

                    // add captions to list
                    capName = imgs[i].getAttribute("alt")
                    captionNames.push(capName)

                    // add widths to list
                    nextLeftArray.push(widthTotal - 34) // add to array but compensate for page margin

                    // console.log("with margin total: " + widthTotal);
                    // console.log('testWidth is: ' + testWidth)
                    // console.log('calculating img.clientWidth and adding widthTotal')

                    // adds fade class used by the CSS for border transition animation
                    imgs[i].classList.add("border-fade");

                }

                // set max width of element to the sum of its images within it (plus margins, etc)
                var elem = document.getElementsByClassName("sqs-wrapper")[0];

                // console.log("setting new maxWidth: " + widthTotal + "px")
                elem.style.maxWidth = "" + widthTotal + "px";

                var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];

                // identify the last image in the carousel clicked and add identifying class
                var lastImage = imgs[imgs.length - 1]; // find last image
                // var secondLastImage = imgs[imgs.length - 2];  // not used
                var resetFlag = false;
                var sqsListenerRemoved = false

                if (portraitPage) {
                    // console.log('adding listener')
                    // secondLastImage.addEventListener("click", resetBanner, true );  // not used
                    lastImage.addEventListener("click", resetBanner, true);
                }

                function imageVisible(el) {
                    // console.log("image visible function...");
                    var rect = el.getBoundingClientRect();
                    var elemRight = rect.right
                    viewport = window.innerWidth;
                    if (elemRight < viewport) {
                        // console.log('image is fully visible')
                        nudgeBannerAlong(el.clientWidth / 20);
                        // console.log('...nudged')
                        return true;
                    }
                }

                function nudgeBannerAlong(pixels) {
                    /** shifts the scroll left position by the number of pixels*/
                    if (window.innerWidth > 1024) {
                        // console.log('nudgeBannerAlong: ' + pixels)
                        //galleryStrip.scrollLeft = pixels;
                        $(galleryStrip).animate({
                            scrollLeft: pixels
                        }, 100);
                    }

                }


                function bannerScrollObserver() {
                    /** uses imageVisible function to update the DOM for a banner reset - removes existing listener if relevant  */
                    // console.log('initialise bannerScrollObserver')
                    var wrapper = document.getElementsByClassName('sqs-wrapper')[0];
                    scrollDelay = 50
                    /** detects when the banner has finished scrolling  */

                    var debounce = false

                    var bannerScrollObserver = new MutationObserver(function(mutation) {
                        // console.log('bannerscroll actions kick in')
                        clearTimeout(debounce)
                        debounce = setTimeout(function() {
                            // console.log('finished scroll')

                            if (imageVisible(lastImage) && !sqsListenerRemoved) {
                                // console.log('image visible, listener present - listener removed')
                                resetFlag = true; // set flag to true - reset banner on next click
                                Y.detach("click", "undefined", lastImage); // detatch listener on last image (and second to last) - can this go in the click handler?
                                sqsListenerRemoved = true
                            } else if (imageVisible(lastImage) && sqsListenerRemoved) {
                                // console.log('image visible, listener already removed - flag set to true')
                                resetFlag = true
                            } else {
                                // console.log('else - flag set to false')
                                resetFlag = false;
                            }

                        }, scrollDelay)

                    })

                    bannerScrollObserver.observe(wrapper, {
                        attributes: true,
                        subtree: false,
                        attributeFilter: ['style']
                    })
                }


                if (portraitPage) {
                    if (window.innerWidth > 1024) {
                        // console.log('over 1024px on portrait - run bannerScrollObserver')
                        bannerScrollObserver()
                    }
                }


                function resetBanner(ev) {
                    // console.log('resestBanner function')
                    // console.log('resetFlag is: ' + resetFlag)
                    if (resetFlag) {
                        // console.log('reset banner: ' + resetFlag)
                        $(elem).animate({
                            left: '0'
                        });
                        nudgeBannerAlong(0) // sometimes on rest the first caption is partially obscured - this helps 
                    } else if ((sqsListenerRemoved) && (ev.target == lastImage)) {
                        var imageRight = lastImage.getBoundingClientRect().right;
                        scrollAmount = imageRight - window.innerWidth;
                        if (scrollAmount > 0) {
                            console.log('remove from the scroll: ' + scrollAmount)
                            elemLeftInt = parseFloat(elem.style.left); // convert css value to number
                            extraMargin = 50 // to try and make sure the last image is visible
                            updatedElemLeftInt = elemLeftInt - (scrollAmount + extraMargin)
                            console.log('manual resetBanner')
                            elem.style.left = updatedElemLeftInt.toString() + 'px';
                            console.log('elem.style.left: ' + elem.style.left)
                            nudgeBannerAlong(50) // 1920 px second pass tweak

                            if (imageVisible(lastImage)) {
                                resetFlag = true
                            };
                        }

                    } else {
                        null;
                        //console.log('resetBanner false: do nothing: ' + resetFlag)
                    }
                }


                // console.log('resetFlag 0: ' + resetFlag)
                var visibleFlag = false


                function imageNudgeObserver(nudgePixels) {
                    // console.log("waiting to nudge if required");

                    /** when the last image is active, nudge to the right to ensure it's fully visible using scrollLeft
                    when the last image is not active, remove the nudge  */

                    // console.log("last image width is: " + lastImage.clientWidth)
                    // adjust the size of the nudge based on whether image is landscape or portrait
                    if (lastImage.clientWidth < lastImage.clientHeight) {
                        var nudge = lastImage.clientWidth / 2.5 // in pixels
                    } else {
                        var nudge = nudgePixels // in pixels
                    }

                    var dbTimeout = false // debounce timeout

                    var imgObserver = new MutationObserver(function(mutation) {
                        // console.log('running imageNudgeObserver')

                        if (lastImage.classList.contains('sqs-active-slide')) {
                            // console.log('adding nudge to current scrollLeft of: ' + galleryStrip.scrollLeft)
                            /** debouncer for observer */
                            // console.log('hang on for debounce...')
                            clearTimeout(dbTimeout)
                            dbTimeout = setTimeout(function() {
                                galleryStrip.scrollLeft = nudge;
                                // console.log('debounce cleared. scrollLeft is now ' + galleryStrip.scrollLeft)
                            }, 50)

                        } else {
                            // console.log('resetting scrollLeft to 0')
                            galleryStrip.scrollLeft = 0
                        }
                    })

                    // console.log('last image: ' + typeof lastImage)
                    imgObserver.observe(lastImage, {
                        attributes: true,
                        subtree: false,
                        attributeFilter: ['class']
                    })

                }

                /** functions to run depending upon portrait page status */

                // if portrait page - run these functions
                if (portraitPage) {
                    insertCaption(nextLeftArray, captionNames) // insert the captions on the portrait page
                    // console.log('running portrait mode')
                }

                // if not portrait page (and now, not mobile) - run these functions
                if (!portraitPage && (window.innerWidth > 1024)) {
                    // console.log('running not-portrait mode')
                    imageNudgeObserver(100) // nudge if not on the portrait page  
                }
            }
        } else {
            null;
        }
    };


    function runObserver() {
        /**
        This function uses a mutation observer to detect changes in the data-image-resolution attribute on the banner.
        There are only a few DOM elements
        that fire on each page.
        This function is responsible for firing trimDiv, updateBannerScroll, equalize height and updateCopyright each time a new page is opened
        */

        // console.log("start function runObserver");
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        var element = document.querySelector('#content'); // ouer wrapper used

        var actions = false // placeholder value for action in the MutationObserver

        var observer = new MutationObserver(function(mutations) {
            // console.log("start new observer");
            // console.log("mutations length :" + mutations.length);

            // debouncing - ensures functions aren't called unnecessarily. These functions execute when another mutation isn't triggered within  the delay (ms)
            var delay = 400

            clearTimeout(actions)

            actions = setTimeout(function() {
                // console.log('ok doing something now')
                trimDiv();
                updateBannerScroll();
                equalizeHeight();
                updateCopyright();
            }, delay);


        });

        // run observer with below parameters
        observer.observe(element, {
            attributes: true,
            subtree: true,
            attributeFilter: ['data-image-resolution'] //listen for changes to this specific attribute only
        });

    }

    function ajaxObserver() {
        /**
        Checks for changes in the 'data-ajax-loaded' attribute on the body of an element. It is used to trigger the footer. 
        */

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        var element = document.querySelector('body'); // main body used

        var actions = false // placeholder value for action in the MutationObserver

        var observer = new MutationObserver(function(mutations) {
            
            // debouncing - ensures functions aren't called unnecessarily. These functions execute when another mutation isn't triggered within  the delay (ms)
            var delay = 100

            clearTimeout(actions)

            actions = setTimeout(function() {
                updateCopyright();
            }, delay);


        });

        // run observer with below parameters
        observer.observe(element, {
            attributes: true,
            subtree: true,
            attributeFilter: ['data-ajax-loader'] //listen for changes to this specific attribute only
        });

    }
</script>