let path, logo = new Logo();
logo
  .on('tortoise.change', function(tortoise) {
    let t = document.getElementById('tortoise'),
      transform = 'translate(' + tortoise.x + ',' + tortoise.y + ') rotate(' + -tortoise.angle + ')';
    t.setAttribute('transform', transform);
    t.setAttribute('fill', tortoise.color);
    t.setAttribute('stroke', tortoise.color);
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
document.getElementById('run').addEventListener('click', function(e) {
  e.preventDefault();
  logo.runInput(document.getElementById('program').value);
}, false);
