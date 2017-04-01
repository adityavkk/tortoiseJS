# Tortoise
A small LOGO interpreter
View [live demo](https://adityavkk.github.io/tortoise/) 

## Logo
Logo is a dialect of LISP developed in 1967. It was designed to be an
educational language with a low barrier of entry but an extremely high
ceiling. 

It's most-known feature is the turtle, an on-screen "cursor" that shows output from commands for movement and small retractable pen, together producing line graphics.
<!-- ![About_Logo](http://i.imgur.com/5hF3eXg.gif) -->
<!-- ![TortoiseJS](http://i.imgur.com/Mh8LzDi.png) -->
## Usage
Available commands:
```
FORWARD (FW)
BACK (BK)
RIGHT (RT)
LEFT(LT)
PENUP (PU)
SETPENCOLOR integer
PENDOWN (PD)
CLEARSCREEN (CS)

TO funcname
code...
END

REPEAT number [code_block]

MAKE "variable_name
:call_made_variable

SUM a b
DIFFERENCE a b
PRODUCT a b
QUOTIENT a b
REMAINDER a b
MINUS a
```

## Some Example Sketches
### Star
```
TO star
  repeat 5 [ fd 100 rt 144 ]
END
clearscreen
star
```
### Square Spiral
```
make "squarespiral 7
cs
repeat 45 [
    fd :squarespiral
    rt 90
    fd :squarespiral
    rt 90
    make "squarespiral sum 7 :squarespiral
]
```

### Circle
```
cs
repeat 72 [ forward 5 left 5 ]
```
### Flower
```
pd
setpencolor 9
repeat 22
[forward 200
repeat 198 [forward 0.5 rt 1]
forward 200
right 180]
```

### Sunflower
```
cs
repeat 12 [ setpencolor 2 
  repeat 8 
    [ forward 50 rt 45 ] 
  lt 15 setpencolor 1 
  repeat 8 
    [ forward 50 rt 45 ] 
  lt 15 
]
```

### Mandala
```
pu
left 90
forward 100
right 90
pd
repeat 8 [
    rt 45 
    repeat 6 [
        repeat 90 [
            fd 2.5 rt 2
        ]
        rt 90
    ]
]
```

### Mandala 2
```
Make "red 4
Make "blue 2
ps
repeat 12 [ setpencolor :red
repeat 45 [ fd 7 left 4 pu fd 7 left 4 pd ]
setpencolor :blue
repeat 45 [ fd 7 left -4 pu fd 7 left -4 pd ]
right 30 ]
```

### Square Flower
```
cs
make "magenta 6
setpencolor magenta
repeat 90[
repeat 4[
forward 100
right 90
]
right 4
]
```
### Repeating Squares
```
to figure
	right 45
	repeat 4 [ forward 40 left 90 ]
	left 45
end
penup forward 50 pendown
repeat 72 [figure left 95 forward 5 right 90]
```

### Hypercube
```
pd
repeat 8 [
    repeat 4 [
        rt 90 
        fd 100
    ] 
    bk 100 
    lt 45
]
```
### Hexagonal Grid
```
; number of layers
Make "layers 6
Make "count 0
CS
Repeat :layers [
  Make "segs :count
  SetPenColor SUM :count 3
  Repeat 6 [
    Repeat :segs [
      Repeat 2 [ Forward 20 Right 60 ]
      Forward 20
      PenUp Back 20 PenDown
      Left 120
    ]
    Forward 20 Right 60
  ]
  ; Move out to the next layer
  PenUp Left 120 Repeat 2 [ Forward 20 Right 60 ] PenDown
  Make "count SUM :count 1
]
```
## To Do
- Write specs
- Add lexical scoping and parameters to functions
- Better error handling and reporting
- Reduce CPU load by optimizing svg path drawing and css 
- Add feature to watch sketches being drawn
- Implement conditionals and for loops

## Reference
Specs based on the [Berkley LOGO] (https://people.eecs.berkeley.edu/~bh/logo.html)

Based on [LOGO Grammar] (http://cs.brown.edu/~spr/designbook/assign/logo/logo98.pdf)
