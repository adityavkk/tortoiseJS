/* eslint */
let commands = {};
class Logo {
  constructor() {
    this.events = {};
    this.ast = [];
    this.stack = [];
    this.tortoise = new Tortoise(this);
    this.functions = {};
    this.commands = commands;
    this.variables = {};
    this.aliases = {
      'FD': 'FORWARD',
      'BK': 'BACK',
      'LT': 'LEFT',
      'RT': 'RIGHT',
      'PD': 'PENDOWN',
      'CS': 'CLEARSCREEN',
      'PU': 'PENUP'
    }
  }

  on(event, cb) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(cb);
    return this;
  }

  off(event, cb) {
    this.events[event] = this.events[event] || [];
    if (event in this.events) {
      this.events[event].splice(this.events[event].indexOf(cb), 1);
    }
    return this;
  }

  trigger(event) {
    if (event in this.events) {
      for (var i = 0, len = this.events[event].length; i < len; i++) {
        this.events[event][i].apply(this, [].slice.call(arguments, 1));
      }
    }
    return this;
  }

  runInput(input) {
    var tokens = this.tokenizeInput(input),
      tree = this.parseTokens(tokens),
      token;
    while ((token = tree.shift())) {
      //tree is the rest of the tree after shift
      token.evaluate(tree);
    }
  }

  tokenizeInput(input) {
    const lines = input.split(/\n/g);
    const tokens = [];
    let words, i, j, ll, wl;

    for (i = 0, ll = lines.length; i < ll; i++) {
      words = lines[i]
        .replace(/;.*?$/, '')
        .replace('[', ' [ ')
        .replace(']', ' ] ')
        .trim()
        .split(/\s+/);
      for (j = 0, wl = words.length; j < wl; j++) {
        if (words[j]) {
          let token = {
            line: i + 1,
            value: words[j].toUpperCase()
          };
          tokens.push(token);
        }
      }
    }
    return tokens;
  }

  parseTokens(tokens, isFunc) {
    let token, tree = [];
    while (tokens.length) {
      token = tokens.shift();
      if (token.value == '[') {
        tree.push(new ListToken(this.parseTokens(tokens, isFunc), token.line, this));
      } else if (token.value == ']') {
        return tree;
      } else if (token.value == 'TO') {
        token = new FuncDefToken(tokens.shift().value, token.line, this);
        tree.push(token);
        let funcList = new FuncListToken(this.parseTokens(tokens, token.line, true), this);
        tree.push(funcList);
        this.functions[token.value] = funcList;
      } else if (isFunc && token.value == 'END') {
        return tree;
      } else {
        if (token.value[0] == ':') {
          token = new SymbolToken(token.value.substr(1), token.line, this);
        } else if (token.value[0] == '"') {
          token = new WordToken(token.value.substr(1), token.line, this);
        } else if (parseInt(token.value, 10).toString() == token.value) {
          token = new NumberToken(parseInt(token.value, 10), this);
        } else if (parseFloat(token.value).toString() == token.value) {
          token = new NumberToken(parseFloat(token.value), token.line, this);
        } else if (!this.commands[token.value] && !this.aliases[token.value]) {
          token = new FuncToken(token.value, token.line, this);
        } else {
          token = new CommandToken(token.value, token.line, this);
        }
        tree.push(token);
      }
    }
    return tree;
  }
}

commands.REPEAT = {
  'args': [NumberToken, ListToken],
  'f': function(count, list) {
    let copy, i, token, result;
    for (i = 0; i < count; i++) {
      // Need to reuse the same tokens each time through the loop.
      copy = list.slice(0);
      while (copy.length) {
        result = copy.shift().evaluate(copy);
      }
    }
    return result;
  }
};
commands.FORWARD = {
  'args': [NumberToken],
  'f': function(distance) {
    this.tortoise.move(distance);
  }
};
commands.BACK = {
  'args': [NumberToken],
  'f': function(distance) {
    this.tortoise.move(-distance);
  }
};
commands.LEFT = {
  'args': [NumberToken],
  'f': function(degrees) {
    this.tortoise.rotate(-degrees);
  }
};
commands.RIGHT = {
  'args': [NumberToken],
  'f': function(degrees) {
    this.tortoise.rotate(degrees);
  }
};
commands.HOME = {
  'args': [],
  'f': function() {
    this.tortoise.goHome();
  }
};
commands.CLEAN = {
  'args': [],
  'f': function() {
    this.trigger('path.remove_all');
    this.tortoise.startPath();
  }
};
commands.CLEARSCREEN = {
  'args': [],
  'f': function() {
    this.commands.CLEAN.f.apply(this);
    this.commands.HOME.f.apply(this);
  }
};
commands.PENUP = {
  'args': [],
  'f': function() {
    this.tortoise.penUp();
  }
};
commands.PENDOWN = {
  'args': [],
  'f': function() {
    this.tortoise.penDown();
  }
};
commands.SETPENCOLOR = {
  'args': [NumberToken],
  'f': function(value) {
    let colors = ['magenta', 'cadetblue', 'salmon', 'cyan', 'aqua', 'white', 'purple',
      'chocolate', 'tan', 'azure', 'seagreen', 'brown', 'green', 'orange',
      'firebrick', 'forest', 'yellow', 'blue', 'olivedrab', 'red', 'grey'
    ];
    if (colors[value]) {
      this.tortoise.penColor(colors[value]);
    }
  }
};
commands.PRINT = {
  'args': [null],
  'f': function(arg) {
    console.log(arg);
  }
};
commands.MAKE = {
  'args': [WordToken, null],
  'f': function(name, value) {
    this.variables[name] = value;
    return value;
  }
};
commands.SUM = {
  'args': [NumberToken, NumberToken],
  'f': function(a, b) {
    return a + b;
  }
};
commands.DIFFERENCE = {
  'args': [NumberToken, NumberToken],
  'f': function(a, b) {
    return a - b;
  }
};
commands.MINUS = {
  'args': [NumberToken],
  'f': function(value) {
    return -value;
  }
};
commands.QUOTIENT = {
  'args': [NumberToken, NumberToken],
  'f': function(a, b) {
    return a / b;
  }
};
commands.PRODUCT = {
  'args': [NumberToken, NumberToken],
  'f': function(a, b) {
    return a * b;
  }
};
commands.REMAINDER = {
  'args': [NumberToken, NumberToken],
  'f': function(a, b) {
    return a % b;
  }
};
