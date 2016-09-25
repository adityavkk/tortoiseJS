// var con = document.getElementById('console');
// con.style.width = window.innerWidth / 2 + "px";
// con.style.height = window.innerHeight + "px";
var path;
var logo = new Logo();
logo
  .on('turtle.change', function(turtle) {
    // Headings (angles) are measured in degrees clockwise from the positive Y
    // axis.
    var t = document.getElementById('turtle'),
      transform = 'translate(' + turtle.x + ',' + turtle.y + ') rotate(' + -turtle.angle + ')';
    t.setAttribute('transform', transform);
    t.setAttribute('fill', turtle.color);
    t.setAttribute('stroke', turtle.color);
  })
  .on('path.start', function(info) {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add('trail');
    path.setAttribute('d', 'M ' + info.x + ',' + info.y);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', info.color);
    path.setAttribute('stroke-width', 2);
    document.getElementById('slate').appendChild(path);
  })
  .on('path.delta', function(info) {
    if (path) {
      path.setAttribute('d', path.getAttribute('d') + ' l ' + info.dx + ',' + info.dy);
    }
  })
  .on('path.end', function() {
    path = null;
  })
  .on('path.remove_all', function() {
    var paths = document.getElementsByClassName('trail');
    while (paths.length) {
      paths[0].remove();
    }
  });
console.log(document.getElementById('run'));
document.getElementById('run').addEventListener('click', function(e) {
  e.preventDefault();
  logo.runInput(document.getElementById('program').value);
}, false);

