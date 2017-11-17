
package require Plotchart

proc extrude'left { path id xcoord ycoord x0 y0 x1 y1 d} {
  $path coords $id [expr { $xcoord - $d }] $y0 $x1 $y1
}
proc extrude'right { path id xcoord ycoord x0 y0 x1 y1 d} {
  $path coords $id $x0 $y0 [expr { $xcoord + $d }] $y1
}
proc extrude'both { path id xcoord ycoord x0 y0 x1 y1 d1 d2} {
  $path coords $id [expr { $xcoord - $d1 }] $y0 [expr { $xcoord + $d2 }] $y1
}

proc begin'extrude { path id xcoord ycoord } {
  set rect [$path coords $id]
  set x0 [lindex $rect 0]
  set y0 [lindex $rect 1]
  set x1 [lindex $rect 2]
  set y1 [lindex $rect 3]
  set l [expr { abs($x1 - $x0) }]
  set l10 [expr { $l * 0.1 }]

  if { $x0 < $xcoord && $xcoord < $x0 + $l10 } {
    $path bind $id <Motion> [list extrude'left %W $id %x %y \
      $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x0) }]]
    return
  } elseif { $x1 - $l10 < $xcoord && $xcoord < $x1 } {
    $path bind $id <Motion> [list extrude'right %W $id %x %y \
      $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x1) }]]
    return
  } else {
    $path bind $id <Motion> [list extrude'both %W $id %x %y \
      $x0 $y0 $x1 $y1 \
      [expr { abs($xcoord - $x0) }] [expr { abs($xcoord - $x1) }]]
  }
}

proc end'extrude { path id task } {
  $path bind $id <Motion> {}
  puts $task

  ganttchart_.c connect [list 28 29 30 31] [list 36 37 38 39]
}

canvas .c -width 500 -bg gray
pack   .c -fill both
.c delete all

set s [::Plotchart::createGanttchart .c "1 january 2004" \
        "1 march 2005" 10 1 -ylabelwidth 1]

set spring [$s task "5.1.3 Realizacion..." "1 march 2004" "1 june 2004" 100]
set sCC [.c coords [lindex $spring 2]]
.c coords [lindex $spring 2] [lindex $sCC 0] [lindex $sCC 1] [expr { 5 + [lindex $sCC 2] }] [lindex $sCC 3]

set summer [$s task "5.1.1 Desmonte de..." "1 june 2004" "1 september 2004" 100]
set winter [$s task "5.1.2 Demolicion ..." "1 september 2004" "20 december 2004" 100]
puts "$spring // $summer // $winter"
$s summary "5.1 Preliminares" $spring $summer $winter

set spring1 [$s task "5.2.4 Vaciado de..." "1 march 2004" "1 june 2004" 100]
puts $::Plotchart::scaling(.c,current)
set summer1 [$s task "5.2.1 Replanteo ..." "1 june 2004" "1 september 2004" 100]
set winter1 [$s task "5.2.2 Otra cosa ..." "1 september 2004" "20 december 2004" 100]
$s summary "5.2 Cimentacion" $spring1 $summer1 $winter1

puts $summer1
.c delete 46 47 48 49
set ::Plotchart::scaling(.c,current) 4
set summer1 [$s task "5.2.1 Replantear..." "1 june 2004" "1 september 2004" 100]
puts $summer1

set connection [$s connect $spring $summer]
puts $connection
.c itemconfigure $connection -fill red

.c itemconfigure [lindex $spring 3] -text {}

$s vertline "1 jan" "1 january 2004"
$s vertline "1 apr" "1 april 2004"
$s vertline "1 jul" "1 july 2004"
$s vertline "1 oct" "1 october 2004"
$s vertline "31 dec" "31 december 2004"
$s title "Seasons (northern hemisphere)"

.c bind [lindex $spring 1] <ButtonPress-1> [list \
  begin'extrude %W [lindex $spring 1] %x %y]

.c bind [lindex $spring 1] <ButtonRelease-1> [list \
  end'extrude %W [lindex $spring 1] "spring"]
