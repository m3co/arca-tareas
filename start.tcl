
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
set rows 20

canvas .c -width [expr {40 * $months}] -height [expr {20 * $rows}]
pack .c


set s [::Plotchart::createGanttchart .c \
  [clock format $project_start -format {%d %B %Y}] \
  [clock format $project_end -format {%d %B %Y}] 20]

set current_time $project_start
while { $current_time < $project_end } {
  $s vertline [clock format $current_time -format {%d %b}] \
    [clock format $current_time -format {%d %B %Y}]
  set current_time [clock add $current_time 1 months]
}

$s title "Administrador de tiempos (version inicial)"

set spring [$s task "5.1.3 Realizacion..." "1 march 2004" "1 june 2004" 100]

