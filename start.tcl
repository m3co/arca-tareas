
package require Plotchart

proc howmanymonths { d1 d2 } {
  set c $d1
  set i 1
  while { $c < $d2 } {
    set c [clock add $c 1 months]
    incr i
  }
  return $i
}

set project_start [clock scan "2004-01-01 00:00:00" -format {%Y-%m-%d %H:%M:%S}]
set project_end [clock scan "2006-04-01 00:00:00" -format {%Y-%m-%d %H:%M:%S}]
set months [howmanymonths $project_start $project_end]

canvas .c -width [expr {40 * $months}] -height 200
pack .c


set s [::Plotchart::createGanttchart .c \
  [clock format $project_start -format {%d %B %Y}] \
  [clock format $project_end -format {%d %B %Y}] 10]

set current_time $project_start
set i 1
while { $current_time < $project_end } {
  #puts [clock format $current_time -format {%Y-%m-%d %H:%M:%S}]
  $s vertline [clock format $current_time -format {%d %b}] \
    [clock format $current_time -format {%d %B %Y}]
  set current_time [clock add $current_time $i months]
}
puts $i
#for { set i 1 } { $i < 10 } { incr i } {
#  puts [clock format [clock add $t $i months] -format {%Y-%m-%d %H:%M:%S}]
#}

$s title "Administrador de tiempos (version inicial)"

set spring [$s task "5.1.3 Realizacion..." "1 march 2004" "1 june 2004" 100]

