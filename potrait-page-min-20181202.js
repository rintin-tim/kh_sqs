<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.2/jquery.matchHeight-min.js"></script>

<script>
        window.addEventListener("load", function() {
      trimDiv();
      runObserver();
      equalizeHeight();
      updateCopyright();
      window.onresize = function() {
        trimDiv();
        runObserver();
      };
    });
    function updateCopyright() {
      var year = (new Date).getFullYear();
      var copyText = "Copyright \u00a9 Katie Hyams " + year;
      $("footer p").text(copyText);
    }
    function equalizeHeight() {
      var overviewPage = document.getElementById("collection-5a526ba10d9297f9a596a5cb");
      if (overviewPage) {
        $(".image-block-wrapper").matchHeight();
      }
    }
    function updateBannerScroll() {
      var scrollPosition = 0;
      var cancelReset = false;
      var tolerance = 100;
      var viewportWidth = window.innerWidth;
      var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];
      if (galleryStrip && viewportWidth < 1025) {
        galleryStrip.onscroll = function() {
          scrollLog(galleryStrip);
        };
      }
      function scrollLog(galleryStrip) {
        element = galleryStrip;
        var stored = scrollPosition;
        var current = element.scrollLeft;
        if (stored - current > tolerance && current < tolerance) {
          setTimeout(function() {
            updatedScroll = element.scrollLeft;
            if (current == updatedScroll && !cancelReset) {
              console.log("resetting to scrollPosition: " + scrollPosition);
              element.scrollLeft = scrollPosition;
            } else {
              cancelReset = true;
              scrollPosition = current;
            }
          }, 3);
        } else {
          if (stored - current > tolerance && current > tolerance) {
            setTimeout(function() {
              updatedScroll = element.scrollLeft;
              if (current == updatedScroll && !cancelReset) {
                element.scrollLeft = scrollPosition;
              } else {
                cancelReset = true;
                scrollPosition = current;
              }
            }, 3);
          } else {
            scrollPosition = current;
            cancelReset = false;
          }
        }
      }
    }
    function insertCaption(nextLeftArray, captionNames) {
      captionAction = false;
      delay = 250;
      clearTimeout(captionAction);
      captionAction = setTimeout(function() {
        internalInsertCaption(nextLeftArray, captionNames);
      }, delay);
      function internalInsertCaption(nextLeftArray, captionNames) {
        captionArray = captionNames;
        nextLeftArray.unshift(0);
        nextLeftArray.pop();
        nextLeftArray.forEach(function(item, index) {
          var extra = 2;
          item = item + extra * index;
        });
        var sqsWrapperOld = document.getElementsByClassName("sqs-wrapper")[0];
        oldCaptions = document.querySelectorAll("div.sqs-wrapper div");
        oldCaptions.forEach(function(item, index) {
          sqsWrapperOld.removeChild(oldCaptions[index]);
        });
        var array = nextLeftArray;
        array.forEach(function(item, index) {
          var sqsWrapper = document.getElementsByClassName("sqs-wrapper")[0];
          var newDiv = document.createElement("div");
          var content = document.createTextNode(captionArray[index]);
          var styleAttribute = document.createAttribute("style");
          styleAttribute.value = "position: absolute; z-index: 1; float: left; left: " + item + "px; bottom: -3px; padding-left: 5px;";
          newDiv.setAttributeNode(styleAttribute);
          newDiv.appendChild(content);
          sqsWrapper.appendChild(newDiv);
        });
      }
    }
    function trimDiv() {
      var homePage = document.getElementById("collection-5ac681c4aa4a99b176337f89");
      var portraitPage = document.getElementById("collection-5a52a4c753450aea1728c820");
      if (!homePage) {
        var imgs = document.getElementsByClassName("sqs-gallery-design-strip-slide");
        if (imgs.length > 0) {
          var imageNudgeObserver = function(nudgePixels) {
            if (lastImage.clientWidth < lastImage.clientHeight) {
              var nudge = lastImage.clientWidth / 2.5;
            } else {
              var nudge = nudgePixels;
            }
            var dbTimeout = false;
            var imgObserver = new MutationObserver(function(mutation) {
              if (lastImage.classList.contains("sqs-active-slide")) {
                clearTimeout(dbTimeout);
                dbTimeout = setTimeout(function() {
                  galleryStrip.scrollLeft = nudge;
                }, 50);
              } else {
                galleryStrip.scrollLeft = 0;
              }
            });
            imgObserver.observe(lastImage, {attributes:true, subtree:false, attributeFilter:["class"]});
          };
          var resetBanner = function(ev) {
            if (resetFlag) {
              $(elem).animate({left:"0"});
              nudgeBannerAlong(0);
            } else {
              if (sqsListenerRemoved && ev.target == lastImage) {
                var imageRight = lastImage.getBoundingClientRect().right;
                scrollAmount = imageRight - window.innerWidth;
                if (scrollAmount > 0) {
                  console.log("remove from the scroll: " + scrollAmount);
                  elemLeftInt = parseFloat(elem.style.left);
                  extraMargin = 50;
                  updatedElemLeftInt = elemLeftInt - (scrollAmount + extraMargin);
                  console.log("manual resetBanner");
                  elem.style.left = updatedElemLeftInt.toString() + "px";
                  console.log("elem.style.left: " + elem.style.left);
                  nudgeBannerAlong(50);
                  if (imageVisible(lastImage)) {
                    resetFlag = true;
                  }
                }
              } else {
                null;
              }
            }
          };
          var bannerScrollObserver = function() {
            var wrapper = document.getElementsByClassName("sqs-wrapper")[0];
            scrollDelay = 50;
            var debounce = false;
            var bannerScrollObserver = new MutationObserver(function(mutation) {
              clearTimeout(debounce);
              debounce = setTimeout(function() {
                if (imageVisible(lastImage) && !sqsListenerRemoved) {
                  resetFlag = true;
                  Y.detach("click", "undefined", lastImage);
                  sqsListenerRemoved = true;
                } else {
                  if (imageVisible(lastImage) && sqsListenerRemoved) {
                    resetFlag = true;
                  } else {
                    resetFlag = false;
                  }
                }
              }, scrollDelay);
            });
            bannerScrollObserver.observe(wrapper, {attributes:true, subtree:false, attributeFilter:["style"]});
          };
          var nudgeBannerAlong = function(pixels) {
            if (window.innerWidth > 1024) {
              $(galleryStrip).animate({scrollLeft:pixels}, 100);
            }
          };
          var imageVisible = function(el) {
            var rect = el.getBoundingClientRect();
            var elemRight = rect.right;
            viewport = window.innerWidth;
            if (elemRight < viewport) {
              nudgeBannerAlong(el.clientWidth / 20);
              return true;
            }
          };
          var nextLeftArray = [];
          var captionNames = [];
          var widthTotal = 34;
          var testWidth = 0;
          for (var i = 0; i < imgs.length; i++) {
            imgWidth = imgs[i].clientWidth;
            widthTotal += imgWidth;
            testWidth += imgWidth;
            widthTotal += 12;
            capName = imgs[i].getAttribute("alt");
            captionNames.push(capName);
            nextLeftArray.push(widthTotal - 34);
            imgs[i].classList.add("border-fade");
          }
          var elem = document.getElementsByClassName("sqs-wrapper")[0];
          elem.style.maxWidth = "" + widthTotal + "px";
          var galleryStrip = document.getElementsByClassName("sqs-gallery-design-strip")[0];
          var lastImage = imgs[imgs.length - 1];
          var resetFlag = false;
          var sqsListenerRemoved = false;
          if (portraitPage) {
            lastImage.addEventListener("click", resetBanner, true);
          }
          if (portraitPage) {
            if (window.innerWidth > 1024) {
              bannerScrollObserver();
            }
          }
          var visibleFlag = false;
          if (portraitPage) {
            insertCaption(nextLeftArray, captionNames);
          }
          if (!portraitPage && window.innerWidth > 1024) {
            imageNudgeObserver(100);
          }
        }
      } else {
        null;
      }
    }
    function runObserver() {
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      var element = document.querySelector("#content");
      var actions = false;
      var observer = new MutationObserver(function(mutations) {
        var delay = 400;
        clearTimeout(actions);
        actions = setTimeout(function() {
          trimDiv();
          updateBannerScroll();
          equalizeHeight();
          updateCopyright();
        }, delay);
      });
      observer.observe(element, {attributes:true, subtree:true, attributeFilter:["data-image-resolution"]});
    };
    
</script>