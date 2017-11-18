
package require Plotchart

namespace eval tareas {
  proc howmanymonths { d1 d2 } {
    set c $d1
    set i 1
    while { $c < $d2 } {
      set c [clock add $c 1 months]
      incr i
    }
    return $i
  }

  proc render'task { gantt task } {
    upvar $task t
    set canvas [string range $gantt 11 end]

    set item [$gantt task $t(description) $t(start) $t(end) 100]
    $canvas itemconfigure [lindex $item 3] -text {}

    set coords [$canvas coords [lindex $item 2]]
    $canvas coords [lindex $item 2] [lindex $coords 0] [lindex $coords 1] \
      [expr { 5 + [lindex $coords 2] }] [lindex $coords 3]

    $canvas itemconfigure [lindex $item 2] -fill red
  }

  proc init { start end } {
    set project_start [clock scan $start -format {%Y-%m-%d %H:%M:%S}]
    set project_end [clock scan $end -format {%Y-%m-%d %H:%M:%S}]
    set months [howmanymonths $project_start $project_end]
    set rows 20

    canvas .c -width [expr {40 * $months}] -height [expr {20 * $rows}]
    pack .c

    set gantt [::Plotchart::createGanttchart .c \
      [clock format $project_start -format {%d %B %Y}] \
      [clock format $project_end -format {%d %B %Y}] 20]

    set current_time $project_start
    while { $current_time < $project_end } {
      $gantt vertline [clock format $current_time -format {%d %b}] \
        [clock format $current_time -format {%d %B %Y}]
      set current_time [clock add $current_time 1 months]
    }

    $gantt title "Administrador de tiempos (version inicial)"
    return $gantt
  }
}

set gantt [tareas::init "2004-01-01 00:00:00" "2006-04-01 00:00:00"]
array set t1 {
  description "Tarea 1 por hacer"
  start "1 march 2004"
  end "1 june 2004"
}
tareas::render'task $gantt t1
