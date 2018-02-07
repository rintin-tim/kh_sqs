<script src="https://code.jquery.com/jquery-1.10.2.js"></script>

<script>
    window.onload = function() {

		console.log("start onload function");

		// var globalNextLeftArray = [425, 799, 1192, 1550, 1941, 2335, 2708, 3099, 3892, 4250, 4644, 5018, 5376]
		//var globalNextLeftArray = []

        // trimDiv();
		runObserver();
		$(window).on("resize", trimDiv);

		//console.log("globalNextLeftArray is: " + globalNextLeftArray)
		//insertCaption(globalNextLeftArray)
		console.log("ready finished");

    };

  function insertCaption(nextLeftArray, captionNames) {
    //var margin = 0
    //nextLeftArray[0] = margin  // replace first value in list with margin width
    captionArray = captionNames
    nextLeftArray.unshift(0)
    nextLeftArray.pop();
    // add 5 to each 
    nextLeftArray.forEach( function(item, index) {
            var extra = 2
            item = item + (extra * index)
            //item = item + margin + (extra * index)
    }
        )
    console.log("nextLeftArray[0]")
    console.log(nextLeftArray[0])
    console.log(nextLeftArray)
     var sqsWrapperOld = document.getElementsByClassName("sqs-wrapper")[0];
     oldCaptions = document.querySelectorAll("div.sqs-wrapper div");
     console.log(oldCaptions.length)
     oldCaptions.forEach(function(item, index) {
         sqsWrapperOld.removeChild(oldCaptions[index]);
     });
     var array = nextLeftArray;
     array.forEach(function(item, index) {
       	 var sqsWrapper = document.getElementsByClassName("sqs-wrapper")[0];

         var newDiv = document.createElement("div");
         var content = document.createTextNode(captionArray[index]);
         //var content = document.createTextNode("<YOUR_CONTENT>");
         var styleAttribute = document.createAttribute("style");
         styleAttribute.value = "position: absolute; z-index: 1; float: left; left: " + item + "px; bottom: -3px; padding-left: 5px;"
         newDiv.setAttributeNode(styleAttribute); // add style to new div
         newDiv.appendChild(content); // add text to new div
         sqsWrapper.appendChild(newDiv); // add new div to wrapper

     });
 }
    function trimDiv() {
        console.log("trim div kicked in");
        var imgs = document.getElementsByClassName("sqs-gallery-design-strip-slide");
        if (imgs.length > 0) {

        	var nextLeftArray = []
            var captionNames = []  // List of caption names

            var widthTotal = 34; // margin on left and right of screen 
            var border

            for (var i = 0; i < imgs.length; i++) {
                imgWidth = imgs[i].clientWidth;
                widthTotal += imgWidth;
                console.log(imgs[i].clientWidth);
                console.log("total: " + widthTotal);
                widthTotal += 12; // margin between images used to be 10!
                capName = imgs[i].getAttribute("alt")
                captionNames.push(capName)
                nextLeftArray.push(widthTotal-34) 
                console.log("with margin total: " + widthTotal);
            }
            // UNTESTED INNERWIDTH
            if (window.innerWidth < 1368) {
                var elemList = document.getElementsByClassName("sqs-wrapper");
                elem = elemList[0];
                console.log("setting maxWidth: " + widthTotal + "px")
                elem.style.maxWidth = "" + widthTotal + "px";
                console.log(nextLeftArray)
            }
           
           // UNTESTED PORTRAIT PAGE ELEMENT
            portraitPage = document.getElementById("NEED ID")  
            if (portraitPage) {
                insertCaption(nextLeftArray, captionNames)  // insert the captions possibly delay for a second?
            }
        };
    };


    function runObserver() {
        console.log("start function runObserver");

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        var element = document.querySelector('#content'); // valid one

        var observer = new MutationObserver(function(mutations) {
            console.log("start new observer");
            mutations.forEach(function(mutation) {
                console.log("mutation-type: " + mutation.type);
                console.log("mutation-attributeName: " + mutation.attributeName);
                if (mutation.attributeName == "data-image-resolution") {
                    console.log("do something - attributes changed: " + mutation.attributeName);
                    trimDiv();

                }
            });
        });

        observer.observe(element, {
            attributes: true,
            subtree: true,
            attributeFilter: ['data-image-resolution'] //configure it to listen to attribute changes
        });

    }



    console.log("script finished");
</script>



// resize for mobile   

// div.sqs-gallery-container.sqs-gallery-block-slider
// height: 150%;  
  
// img: 95%

// then shove in the caption rules
  

