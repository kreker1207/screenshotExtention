var canvas = document.getElementById("canvas");
var image = document.getElementById("image");
if(canvas && image){
    var canvasContext = canvas.getContext("2d");
    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        canvasContext.drawImage(image, 0, 0);
    };
    image.src = window.location.hash.substr(1);

    // Cut button
    var cutBtn = document.getElementById("cut-btn");
    if(cutBtn){
        cutBtn.addEventListener("click", function() {
            activateCut();
        });
    }

    // Rotate button
    var rotateBtn = document.getElementById("rotate-btn");
    if(rotateBtn){
        rotateBtn.addEventListener("click", function() {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = image.height;
            canvas.height = image.width;
            canvasContext.translate(canvas.width / 2, canvas.height / 2);
            canvasContext.rotate(Math.PI / 2);
            canvasContext.drawImage(image, -image.width / 2, -image.height / 2);
            image.src = canvas.toDataURL();
        });
    }

    // Text button
    var textBtn = document.getElementById("text-btn");
    if(textBtn){
        textBtn.addEventListener("click", function() {
            var text = prompt("Enter text to add:");
            if (text) {
                canvasContext.font = "20px Arial";
                canvasContext.fillStyle = "white";
                canvasContext.fillText(text, 10, 50);
                image.src = canvas.toDataURL();
            }
        });
    }

    // Paint button
    var paintBtn = document.getElementById("paint-btn");
    var isPainting = false;
    var lastX, lastY;
    if(paintBtn){
        paintBtn.addEventListener("mousedown", function(e) {
            isPainting = true;
            lastX = e.clientX - canvas.offsetLeft;
            lastY = e.clientY - canvas.offsetTop;
        });
        paintBtn.addEventListener("mouseup", function() {
            isPainting = false;
        });
        canvas.addEventListener("mousemove", function(e) {
            if (isPainting) {
                var x = e.clientX - canvas.offsetLeft;
                var y = e.clientY - canvas.offsetTop;
                canvasContext.strokeStyle = "white";
                canvasContext.lineWidth = 10;
                canvasContext.beginPath();
                canvasContext.moveTo(lastX, lastY);
                canvasContext.lineTo(x, y);
                canvasContext.stroke();
                lastX = x;
                lastY = y;
                image.src = canvas.toDataURL();
            }
        });
    }

    function activateCut() {
        canvas.width = image.width;
        canvas.height = image.height;

        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);

        var selection = new Selection(canvas, context);
        selection.onFinish = function(x, y, width, height) {
            cropImage(canvas, x, y, width, height);
        }
    }
}