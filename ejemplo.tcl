
package require Plotchart

proc showme { path id xcoord ycoord } {
  set m [$path coords $id]
  $path coords $id [lindex $m 0] [lindex $m 1] \
    [expr { [lindex $m 2] + 20 }] [lindex $m 3]
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
  showme %W [lindex $spring 2] %x %y]
