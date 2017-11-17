
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

puts $s
$s font scale "times 10"
$s font description "times 1"


set spring [$s task "" "1 march 2004" "1 june 2004" 0]
set summer [$s task "" "1 june 2004" "1 september 2004" 0]
set winter [$s task "" "1 september 2004" "20 december 2004" 0]
puts "$spring // $summer // $winter"
$s summary "1" $spring $summer $winter

set spring1 [$s task "" "1 march 2004" "1 june 2004" 0]
puts $::Plotchart::scaling(.c,current)
set summer1 [$s task "" "1 june 2004" "1 september 2004" 0]
set winter1 [$s task "" "1 september 2004" "20 december 2004" 0]
$s summary "2" $spring1 $summer1 $winter1

puts $summer1
.c delete 46 47 48 49
set ::Plotchart::scaling(.c,current) 4
set summer1 [$s task "" "1 june 2004" "1 september 2004" 0]
puts $summer1

set connection [$s connect $spring $winter]
puts $connection
set connection2 [$s connect $spring $winter]
puts $connection2

.c delete $connection
.c delete $connection2

$s vertline "1 jan" "1 january 2004"
$s vertline "1 apr" "1 april 2004"
$s vertline "1 jul" "1 july 2004"
$s vertline "1 oct" "1 october 2004"
$s vertline "31 dec" "31 december 2004"
$s title "Seasons (northern hemisphere)"

.c bind [lindex $spring 2] <ButtonPress-1> [list \
  begin'extrude %W [lindex $spring 2] %x %y]

.c bind [lindex $spring 2] <ButtonRelease-1> [list \
  end'extrude %W [lindex $spring 2] "spring"]
