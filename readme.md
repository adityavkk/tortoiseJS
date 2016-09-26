#Tortoise JS
A small LOGO interpreter written in JS.
##Usage
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
```

##Some Example Shapes
###Square Spiral
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

###Circle
```
cs
repeat 72 [ forward 5 left 5 ]
```
###Flower
```
pd
setpencolor 9
repeat 22
[forward 200
repeat 198 [forward 0.5 rt 1]
forward 200
right 180]
```

###Sunflower
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

###Mandala
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

###Mandala 2
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

###Square Flower
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
###Repeating Squares
```
to figure
	right 45
	repeat 4 [ forward 40 left 90 ]
	left 45
end
penup forward 50 pendown
repeat 72 [figure left 95 forward 5 right 90]
```

###Hypercube
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
