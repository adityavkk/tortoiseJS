function Turtle(emitter) {
  this.emitter = emitter;
  this.color = 'green';
  this.drawing = true;
  this.goHome();
  this.startPath();
}

Turtle.prototype.startPath = function () {
  if (this.drawing) {
    // TODO we should avoid starting new paths if we didn't move in our old one.
    var info = { x: this.x, y: this.y, color: this.color };
    this.emitter.trigger('path.start', info);
  }
};

Turtle.prototype.endPath = function () {
  if (this.drawing) {
    this.emitter.trigger('path.end');
  }
};

Turtle.prototype.penUp = function () {
  this.endPath();
  this.drawing = false;
};

Turtle.prototype.penDown = function () {
  if (!this.drawing) {
    this.drawing = true;
    this.startPath();
  }
};

Turtle.prototype.penColor = function (color) {
  if (this.color != color) {
    this.color = color;
    this.endPath();
    this.startPath();
    this.update();
  }
};

Turtle.prototype.goHome = function () {
  this.endPath();
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.update();
  this.startPath();
};

Turtle.prototype.move = function(distance) {
  var rads = this.angle * Math.PI / 180
    , dx = distance * Math.sin(rads)
    , dy = distance * Math.cos(rads)
    ;
  if (this.drawing) {
    this.emitter.trigger('path.delta', { dx: dx, dy: dy });
  }
  this.x += dx;
  this.y += dy;
  this.update();
};

Turtle.prototype.rotate = function(degrees) {
  this.angle = (this.angle + degrees) % 360;
  this.update();
};

Turtle.prototype.update = function () {
  this.emitter.trigger('turtle.change', this);
};

