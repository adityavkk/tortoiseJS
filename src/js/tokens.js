class Token {
  constructor(value, line, context) {
    this.value = value;
    this.line = line;
    this.context = context;
  }
  evaluate() {
    return this.value
  }
}

class ListToken extends Token {}

class FuncDefToken extends Token {}

class FuncToken extends Token {
  evaluate() {
    let funcList = this.context.functions[this.value];
    if (!funcList) {
      console.log('Unexpected command', this.value, 'on line', this.line);
      return false;
    }
    let funcListVal = funcList.value.slice(),
      token;
    while ((token = funcListVal.shift())) {
      token.evaluate(funcListVal);
    }
  }
}

class FuncListToken extends Token {}

class WordToken extends Token {}

class NumberToken extends Token {}

class SymbolToken extends Token {
  evaluate() {
    return this.context.variables[this.value];
  }
}

class CommandToken extends Token {
  constructor(value, line, context) {
    super(value, line, context);
    this.value = context.aliases[value] || value;
    this.command = context.commands[this.value];
  }

  evaluate(list) {
    let command = this.command,
      args = [],
      argToken;
    if (!command) {
      console.log("Unknown command " + this.value + " on line " + this.line);
      return false;
    }
    // command.args is how many args that command and what kind of token the args are
    for (let i = 0, l = command.args.length; i < l; i++) {
      argToken = list.shift();
      if (argToken instanceof CommandToken) {
        args.push(argToken.evaluate(list));
      } else {
        args.push(argToken.evaluate());
      }
    }
    return this.command.f.apply(this.context, args);
  }
}
