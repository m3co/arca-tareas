
package require Plotchart

proc extrude'left { path id xcoord ycoord x0 y0 x1 y1 d} {
  $path coords $id [expr { $xcoord - $d }] $y0 $x1 $y1
}
proc extrude'right { path id xcoord ycoord x0 y0 x1 y1 d} {
  $path coords $id $x0 $y0 [expr { $xcoord + $d }] $y1
}

proc begin'extrude { path id xcoord ycoord } {
  set rect [$path coords $id]
  set x0 [lindex $rect 0]
  set y0 [lindex $rect 1]
  set x1 [lindex $rect 2]
  set y1 [lindex $rect 3]
  set l [expr { abs($x1 - $x0) }]
  set l10 [expr { $l * 0.1 }]

  puts $l
  puts "$xcoord $ycoord"
  puts $rect

  if { $x0 < $xcoord && $xcoord < $x0 + $l10 } {
    $path bind $id <Motion> [list extrude'left %W $id %x %y \
      $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x0) }]]
  }
  if { $x1 - $l10 < $xcoord && $xcoord < $x1 } {
    $path bind $id <Motion> [list extrude'right %W $id %x %y \
      $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x1) }]]
  }
}

proc end'extrude { path id } {
  $path bind $id <Motion> {}
}

canvas .c -width 500 -height 180 -bg gray
pack   .c -fill both
.c delete all

set s [::Plotchart::createGanttchart .c "1 january 2004" \
        "1 march 2005" 4 1 -ylabelwidth 1]

$s font scale "times 10"
$s font description "times 1"

set spring [$s task "" "1 march 2004" "1 june 2004" 0]
set summer [$s task "" "1 june 2004" "1 september 2004" 0]
set winter [$s task "" "1 september 2004" "20 december 2004" 0]
$s summary "" $spring $summer $winter
#$s connect $spring $summer
$s vertline "1 jan" "1 january 2004"
$s vertline "1 apr" "1 april 2004"
$s vertline "1 jul" "1 july 2004"
$s vertline "1 oct" "1 october 2004"
$s vertline "31 dec" "31 december 2004"
$s title "Seasons (northern hemisphere)"

.c bind [lindex $spring 2] <ButtonPress-1> [list \
  begin'extrude %W [lindex $spring 2] %x %y]

.c bind [lindex $spring 2] <ButtonRelease-1> [list \
  end'extrude %W [lindex $spring 2]]
