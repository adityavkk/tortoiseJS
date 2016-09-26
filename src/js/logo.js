/* eslint */

function Logo() {
  this.events = {};
  this.variables = {};
  this.ast = [];
  this.stack = [];
  this.turtle = new Turtle(this);
}

// Micro event emitter
Logo.prototype.on = function(event, callback) {
  this.events[event] = this.events[event] || [];
  this.events[event].push(callback);
  return this;
};
Logo.prototype.off = function(event, callback) {
  this.events[event] = this.events[event] || [];
  if (event in this.events) {
    this.events[event].splice(this.events[event].indexOf(callback), 1);
  }
  return this;
};

Logo.prototype.trigger = function(event /* ...args */ ) {
  if (event in this.events) {
    for (var i = 0, len = this.events[event].length; i < len; i++) {
      this.events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
  return this;
};

Logo.prototype.runInput = function(input) {
  var tokens = this.tokenizeInput(input),
    tree = this.parseTokens(tokens),
    token;
  while ((token = tree.shift())) {
    //tree is the rest of the tree after shift
    token.evaluate(tree);
  }
};

Logo.prototype.tokenizeInput = function(input) {
  var lines = input.split(/\n/g),
    tokens = [],
    words, i, j, ll, wl;

  for (i = 0, ll = lines.length; i < ll; i++) {
    words = lines[i]
      // Remove comments (semi-colon to end of line).
      .replace(/;.*?$/, '')
      // Add whitespace around square brackets so they split correctly.
      .replace('[', ' [ ')
      .replace(']', ' ] ')
      // Remove leading or trailing whitespace.
      .trim()
      // Split by white space.
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
};

Logo.prototype.parseTokens = function(tokens, isFunc) {
  var token, tree = [];
  while (tokens.length) {
    token = tokens.shift();
    if (token.value == '[') {
      tree.push(new ListToken(this.parseTokens(tokens, isFunc), token.line, this));
    } else if (token.value == ']') {
      return tree;
    } else if (token.value == 'TO') {
      token = new FuncDefToken(tokens.shift().value, token.line, this);
      tree.push(token);
      let funcList = new FuncListToken(this.parseTokens(tokens, true), token.line, this);
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
        token = new NumberToken(parseInt(token.value, 10), token.line, this);
      } else if (parseFloat(token.value).toString() == token.value) {
        token = new NumberToken(parseFloat(token.value), token.line, this);
      } else if (!this.commands[token.value] && !this.aliases[token.value]) {
        token = new FuncToken(token.value, token.line, this);
        console.log('command', this.commands)
        console.log('FUNCTION', token);
      } else {
        token = new CommandToken(token.value, token.line, this);
      }
      tree.push(token);
    }
  }
  return tree;
};

function Token(value, line, context) {}
Token.prototype.evaluate = function() {
  return this.value;
};

function ListToken(value, line, context) {
  this.line = line;
  this.value = value;
}
ListToken.prototype = new Token();

function FuncDefToken(value, line, context) {
  this.line = line;
  this.value = value;
  this.context = context;
}
FuncDefToken.prototype = new Token();

function FuncToken(value, line, context) {
  this.line = line;
  this.value = value;
  this.context = context;
}
FuncToken.prototype = new Token();
FuncToken.prototype.evaluate = function(remTree) {
  let funcList = this.context.functions[this.value],
    token;
  console.log('evaluate', this.context.functions, funcList);
  while ((token = funcList.value.shift())) {
    token.evaluate(funcList.value);
  }
}

function FuncListToken(value, line, context) {
  this.value = value;
  this.line = line;
  this.context = context;
}
FuncListToken.prototype = new Token();

function WordToken(value, line, context) {
  this.line = line;
  this.value = value;
}
WordToken.prototype = new Token();

function NumberToken(value, line, context) {
  this.line = line;
  this.value = value;
}
NumberToken.prototype = new Token();

// TODO I'm not in love with the name... VariableToken maybe?
function SymbolToken(value, line, context) {
  this.line = line;
  this.value = value;
  this.context = context;
}
SymbolToken.prototype = new Token();
SymbolToken.prototype.evaluate = function() {
  return this.context.variables[this.value];
};

function CommandToken(value, line, context) {
  this.line = line;
  // Look up aliases.
  this.value = context.aliases[value] || value;
  this.command = context.commands[this.value];
  this.context = context;
}
CommandToken.prototype = new Token();
CommandToken.prototype.evaluate = function(list) {
  // Check that the correct arguments are available.
  var command = this.command,
    args = [],
    argToken;

  if (!command) {
    console.log("Unknown command " + this.value + " on line " + this.line);
    return false;
  }

  // TODO: check that there are enough args available
  // command.args is how many args that command and what kind of token the args are
  for (var i = 0, l = command.args.length; i < l; i++) {
    // TODO check argument types against expected types.
    argToken = list.shift();
    if (argToken instanceof CommandToken) {
      args.push(argToken.evaluate(list));
    } else {
      args.push(argToken.evaluate());
    }
  }

  return this.command.f.apply(this.context, args);
};


Logo.prototype.aliases = {
  'CS': 'CLEARSCREEN',
  'FD': 'FORWARD',
  'BK': 'BACKWARD',
  'RT': 'RIGHT',
  'LT': 'LEFT',
  'PU': 'PENUP',
  'PD': 'PENDOWN',
};

Logo.prototype.commands = {};
Logo.prototype.functions = {};

/*
 arg types:
   v = value
   s = symbol (variable name)
   b = block of commands
*/
// CONTROL FLOW
Logo.prototype.commands.REPEAT = {
  'args': [NumberToken, ListToken],
  'f': function(count, list) {
    var copy, i, token, result;
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
// MOVEMENT
Logo.prototype.commands.FORWARD = {
  'args': [NumberToken],
  'f': function(distance) {
    this.turtle.move(distance);
  }
};
Logo.prototype.commands.BACK = {
  'args': [NumberToken],
  'f': function(distance) {
    this.turtle.move(-distance);
  }
};
Logo.prototype.commands.LEFT = {
  'args': [NumberToken],
  'f': function(degrees) {
    this.turtle.rotate(-degrees);
  }
};
Logo.prototype.commands.RIGHT = {
  'args': [NumberToken],
  'f': function(degrees) {
    this.turtle.rotate(degrees);
  }
};
// DISPLAY
Logo.prototype.commands.HOME = {
  'args': [],
  'f': function() {
    this.turtle.goHome();
  }
};
Logo.prototype.commands.CLEAN = {
  'args': [],
  'f': function() {
    this.trigger('path.remove_all');
    this.turtle.startPath();
  }
};
Logo.prototype.commands.CLEARSCREEN = {
  'args': [],
  'f': function() {
    this.commands.CLEAN.f.apply(this);
    this.commands.HOME.f.apply(this);
  }
};
Logo.prototype.commands.PENUP = {
  'args': [],
  'f': function() {
    this.turtle.penUp();
  }
};
Logo.prototype.commands.PENDOWN = {
  'args': [],
  'f': function() {
    this.turtle.penDown();
  }
};
Logo.prototype.commands.SETPENCOLOR = {
  'args': [NumberToken],
  'f': function(value) {
    var palette = [
      'white', 'blue', 'green', 'cyan', 'red', 'magenta', 'yellow', 'olivedrab',
      'brown', 'tan', 'forest', 'aqua', 'salmon', 'purple', 'orange', 'grey'
    ];
    if (palette[value]) {
      this.turtle.penColor(palette[value]);
    }
  }
};
Logo.prototype.commands.PRINT = {
  'args': [null],
  'f': function(arg) {
    console.log(arg);
  }
};

// VARIABLES
Logo.prototype.commands.MAKE = {
  'args': [WordToken, null],
  'f': function(name, value) {
    this.variables[name] = value;
    return value;
  }
};

// FUNCTIONS
// Logo.prototype.commands.TO = {
// 'args': [CommandToken, ListToken],
// 'f': function(name, list) {
// this.functions[name] = list;
// return list;
// }
// };

// MATH
Logo.prototype.commands.SUM = {
  'args': [NumberToken, NumberToken],
  'f': function(left, right) {
    return left + right;
  }
};
Logo.prototype.commands.DIFFERENCE = {
  'args': [NumberToken, NumberToken],
  'f': function(left, right) {
    return left - right;
  }
};
Logo.prototype.commands.MINUS = {
  'args': [NumberToken],
  'f': function(value) {
    return -value;
  }
};
