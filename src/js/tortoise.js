class Tortoise {
  constructor(emit) {
    this.emitter = emit;
    this.color = 'green';
    this.drawing = true;
    this.goHome();
    this.startPath();
  }

  goHome() {
    this.endPath();
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.update();
    this.startPath();
  }

  startPath() {
    if (this.drawing) {
      let info = {
        x: this.x,
        y: this.y,
        color: this.color
      };
      this.emitter.trigger('path.start', info);
    }
  }

  rotate(degrees) {
    this.angle = (this.angle + degrees) % 360;
    this.update();
  }

  move(distance) {
    var rads = this.angle * Math.PI / 180,
      dx = distance * Math.sin(rads),
      dy = distance * Math.cos(rads);
    if (this.drawing) {
      this.emitter.trigger('path.delta', {
        dx: dx,
        dy: dy
      });
    }
    this.x += dx;
    this.y += dy;
    this.update();
  }

  update() {
    this.emitter.trigger('turtle.change', this);
  }

  penColor(color) {
    if (this.color !== color) {
      this.color = color;
      this.endPath();
      this.startPath();
      this.update();
    }
  }

  endPath() {
    if (this.drawing) {
      this.emitter.trigger('path.end');
    }
  }

  penUp() {
    this.endPath();
    this.drawing = false;
  }

  penDown() {
    if (!this.drawing) {
      this.drawing = true;
      this.startPath();
    }
  }
}
