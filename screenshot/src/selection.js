class Selection {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
  
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }
  
  onMouseDown(event) {
    this.isDragging = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }
  
  onMouseMove(event) {
    if (!this.isDragging) {
      return;
    }
  
    this.currentX = event.offsetX;
    this.currentY = event.offsetY;
    this.draw();
  }
  
  onMouseUp(event) {
    this.isDragging = false;
    const x = Math.min(this.startX, this.currentX);
    const y = Math.min(this.startY, this.currentY);
    const width = Math.abs(this.startX - this.currentX);
    const height = Math.abs(this.startY - this.currentY);
    if (width && height && this.onFinish) {
      this.onFinish(x, y, width, height);
    }
  }
  
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "rgba(0, 0, 0, 0.4)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.clearRect(
      this.startX,
      this.startY,
      this.currentX - this.startX,
      this.currentY - this.startY
    );
  }
}