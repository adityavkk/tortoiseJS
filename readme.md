###Circle
home
repeat 72 [ forward 5 left 5 ]

###Mandala
cs
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

###Mandala 2
Make "red 4
Make "blue 2
cs
repeat 12 [ setpencolor :red
repeat 45 [ fd 7 left 4 pu fd 7 left 4 pd ]
setpencolor :blue
repeat 45 [ fd 7 left -4 pu fd 7 left -4 pd ]
right 30 ]

###Repeating Squares
to figure
	right 45
	repeat 4 [ forward 40 left 90 ]
	left 45
end
cs
penup forward 50 pendown
repeat 72 [figure left 95 forward 5 right 90]

###Hypercube
repeat 8 [
    repeat 4 [
        rt 90 
        fd 100
    ] 
    bk 100 
    lt 45
]
