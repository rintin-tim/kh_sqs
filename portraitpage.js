    <script>
        console.log("script started");
        window.addEventListener('load', function() {
    
        // window.onload = function() {

    		console.log("start onload function");

            trimDiv();
    		runObserver();
            window.onresize = function() { trimDiv(); };
    		//window.addEventListener('resize', trimDiv);  // consider change for onresize
    		console.log("finish onload function");

        });

        function updateBannerScroll() {

            /** maintains the overflow scroll positon when the viewport size 
            changes (e.g. portrait to landscape)
            */
           
           /** store the leftScroll position */
            var scrollPosition = 0

            /** set tolerance */
            var tolerance = 100;

            // overflow page element
            var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];
            
            if (galleryStrip) {
                /** listen for any scroll event and run function. */
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

            // skip function if on the homepage
            if (!homePage) {

                var imgs = document.getElementsByClassName("sqs-gallery-design-strip-slide");  // overflow element
                
                // check images are loaded before continuing 
                if (imgs.length > 0) {

                	var nextLeftArray = []  // list of image widths
                    var captionNames = []  // list of caption names

                    var widthTotal = 34; // // add up the total width of all images. includes value for margin on the left and right of screen 

                    for (var i = 0; i < imgs.length; i++) {
                        // calculate the width of each gallery image 
                        imgWidth = imgs[i].clientWidth;
                        
                        // add the widths to a running total
                        widthTotal += imgWidth;
                        // console.log(imgs[i].clientWidth);
                        // console.log("total: " + widthTotal);
                        widthTotal += 12; // gap between images 
                        
                        // add captions to list
                        capName = imgs[i].getAttribute("alt")
                        captionNames.push(capName)

                        // add widths to list
                        nextLeftArray.push(widthTotal-34) // add to array but compensate for page margin
                        // console.log("with margin total: " + widthTotal);

                        console.log('calculating img.clientWidth and adding widthTotal')
                        
                        // adds fade class used by the CSS for border transition animation
                        imgs[i].classList.add("border-fade");
                    
                    }
                    
                    //console.log("innerWidth: " + window.innerWidth)            
                    
                    // set max width of element to the sum of its images within it (plus margins, etc) 
                    var elem = document.getElementsByClassName("sqs-wrapper")[0];
                    console.log("setting maxWidth: " + widthTotal + "px")
                    elem.style.maxWidth = "" + widthTotal + "px";
    //                console.log(nextLeftArray)

                    // prevent the last image in the carousel being clicked     
                    lastImage = imgs[imgs.length - 1];  // find last image
                   // secondLastImage = imgs[imgs.length - 2];
                    // lastAttribute = document.createAttribute("style")
                    // lastAttribute.value = "pointer-events: none"

                    lastImage.classList.add("last-image")  // in order to apply none pointer in css

                    // console.log("lastImage set to nonePointer")
                   
                    // if portrait page - insert the captions
                    portraitPage = document.getElementById("collection-5a52a4c753450aea1728c820")  
                    if (portraitPage) {
                        insertCaption(nextLeftArray, captionNames)  // insert the captions 
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
                var delay = 250
    
                clearTimeout(actions)

                actions = setTimeout(function() {
                            console.log('ok doing something now')
                            trimDiv();
                            updateBannerScroll();
                            }, delay);


                /*    
                mutations.forEach(function(mutation) {
                   // console.log("mutation-type: " + mutation.type);
                   // console.log("mutation-attributeName: " + mutation.attributeName);
                   // if (mutation.attributeName == "data-image-resolution") {
                        console.log("do something - attributes changed: " + mutation.attributeName);
                        //debugger;

                        clearTimeout(actions)
                        
                        actions = setTimeout(function() {
                            console.log('ok doing something now')
                            trimDiv();
                            updateBannerScroll();
                        }, delay);
                        
                        
                        // observerCount += 1  // TBC
                        // console.log('observerCount is: ' + observerCount)
                    //}
                });
                */
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



