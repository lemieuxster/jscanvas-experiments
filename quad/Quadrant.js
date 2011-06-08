(function() {
    var fragment = document.createDocumentFragment(),
    dupCanvas, dupContext, blockCanvas, blockContext, 
    rectQueue = [], chunkCount = 0, chunkSize = 10,

    load_image = function(imageUrl, callback) {
        var img = new Image();
        img.src = imageUrl;
        img.onload = function() {
            if (callback && typeof callback == "function") {
                callback(img);
            }
        }
    },

    getAverageColor = function(cavasObjContext, rect) {
        var imgd = cavasObjContext.getImageData(0, 0, Math.floor(rect.width), Math.floor(rect.height));
        var pix = imgd.data;
        var r = 0, b = 0, g = 0, a = 0;
        var count = 0;
        // Loop over each pixel and invert the color.
        for (var i = 0, n = pix.length; i < n; i += 4) {
            r += pix[i  ]; // red
            g += pix[i + 1]; // green
            b += pix[i + 2]; // blue
            a += pix[i + 3]; //alpha
            count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        a = Math.floor(a / count);
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    },

    matchesColorThreshold = function(canvasObjContext, rect, threshold) {
        var imgd = canvasObjContext.getImageData(0, 0, Math.floor(rect.width), Math.floor(rect.height));
        var pix = imgd.data;
        var r = 0, b = 0, g = 0, a = 0;
        var oldr, oldb, oldg, olda;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            r = pix[i    ]; // red
            g = pix[i + 1]; // green
            b = pix[i + 2]; // blue
            a = pix[i + 3]; //alpha
            if (typeof oldr === "undefined" ||
                    typeof oldb === "undefined" ||
                    typeof oldg === "undefined" ||
                    typeof olda === "undefined") {
                oldr = r;
                oldb = b;
                oldg = g;
                olda = a;
            } else {
                var rdiff = Math.abs(oldr - r);
                var gdiff = Math.abs(oldg - g);
                var bdiff = Math.abs(oldb - b);
                var adiff = Math.abs(olda - a);
                var avg = (rdiff + gdiff + bdiff + adiff) / 4;
                if (avg > threshold) {
                    return false;
                }
            }
        }
        return true;
    };

    Quadrant = {
        imageHolder : document.body,
        imageUrl : null,
        options : {
            drawFills : true,
            drawStrokes : true,
            minSize : 2,
            colorThreshold : 25,
            backgroundColor : "#111",
            chunkSize : 10
        },
        render : function() {
            dupCanvas = document.createElement("canvas");
            fragment.appendChild(dupCanvas);
            dupContext = dupCanvas.getContext("2d");
            dupCanvas.style.display = "none";

            blockCanvas = document.createElement("canvas");
            this.imageHolder.appendChild(blockCanvas);
            blockContext = blockCanvas.getContext("2d");
            //this.blockCanvas.style.display = "none";

            chunkSize = (this.options.chunkSize > 0) ? this.options.chunkSize : chunkSize;

            var quadrantMaker = this;
            load_image(this.imageUrl, function(imgObj) {
                var w = imgObj.width;
                var h = imgObj.height;
                dupCanvas.width = w;
                dupCanvas.height = h;

                blockCanvas.width = w;
                blockCanvas.height = h;

                blockContext.fillStyle = quadrantMaker.options.backgroundColor;
                blockContext.fillRect(0, 0, w, h);

                dupContext.drawImage(imgObj, 0, 0);

                rectQueue.push({x: 0, y: 0, width: w, height: h});
                quadrantMaker.drawQuads();
            });
        },
        drawQuads : function() {
            chunkCount++;
            var quadrantMaker = this;
            var tempCanvas = document.createElement("canvas");
            var tempContext = tempCanvas.getContext("2d");

            try {
                var rect = rectQueue.shift();
                tempCanvas.width = rect.width;
                tempCanvas.height = rect.height;
                var imgdata = dupContext.getImageData(rect.x, rect.y, rect.width, rect.height);
                tempContext.putImageData(imgdata, 0, 0);

                var minSize = quadrantMaker.options.minSize;
                minSize = minSize < 2 ? 2 : minSize;

                var colorThreshold = quadrantMaker.options.colorThreshold;
                colorThreshold = colorThreshold < 2 ? 2 : colorThreshold;
                colorThreshold = colorThreshold > 255 ? 255 : colorThreshold;

                var drawFills = quadrantMaker.options.drawFills;
                var drawStrokes = quadrantMaker.options.drawStrokes;

                if (rect.width < minSize || rect.height < minSize || matchesColorThreshold(tempContext, rect, colorThreshold)) {
                    var newColor = getAverageColor(tempContext, rect);
                    if (drawFills) {
                        blockContext.fillStyle = newColor;
                        blockContext.fillRect(rect.x, rect.y, rect.width, rect.height);
                    }

                    if (drawStrokes) {
                        blockContext.strokeStyle = newColor;
                        blockContext.strokeRect(rect.x, rect.y, rect.width, rect.height);
                    }
                } else {
                    var newRWidth = rect.width / 2;
                    var newRHeight = rect.height / 2;
                    var rectI = {x: rect.x, y: rect.y, width: newRWidth, height: newRHeight};
                    var rectII = {x: rect.x + newRWidth, y: rect.y, width: newRWidth, height: newRHeight};
                    var rectIII = {x: rect.x, y: rect.y + newRHeight, width: newRWidth, height: newRHeight};
                    var rectIV = {x: rect.x + newRWidth, y: rect.y + newRHeight, width: newRWidth, height: newRHeight};
                    rectQueue = rectQueue.concat([rectI, rectII, rectIII, rectIV]);
                }
            } catch (ignored) {
                console.log(ignored);
            }


            if (rectQueue.length === 0) {
                chunkCount = 0
                var img = new Image();
                img.src = blockCanvas.toDataURL();
                blockCanvas.style.display = "none";
                quadrantMaker.imageHolder.removeChild(blockCanvas);
                fragment.removeChild(dupCanvas);
                quadrantMaker.imageHolder.appendChild(img);
            } else {
                if (chunkCount <= chunkSize) {
                    quadrantMaker.drawQuads();
                } else {
                    chunkCount = 0;
                    setTimeout(function() {
                        quadrantMaker.drawQuads()
                    }, 2);
                }
            }
        }
    };
})();