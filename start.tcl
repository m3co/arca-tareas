
package require Plotchart

namespace eval tareas {
  variable tasks

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
    variable tasks

    set canvas [string range $gantt 11 end]
    set item [$gantt task "$t(keynote) $t(description)" $t(start) $t(end) 100]

    $canvas itemconfigure [lindex $item 3] -text {}

    set coords [$canvas coords [lindex $item 2]]
    $canvas coords [lindex $item 2] [lindex $coords 0] [lindex $coords 1] \
      [expr { 5 + [lindex $coords 2] }] [lindex $coords 3]

    $canvas itemconfigure [lindex $item 2] -fill red

    array set internal {}
    set internal(payload) [array get t]
    set internal(task) $item
    set tasks($t(id)) [array get internal]
  }

  proc init { start end } {
    set project_start [clock scan $start -format {%Y-%m-%d %H:%M:%S}]
    set project_end [clock scan $end -format {%Y-%m-%d %H:%M:%S}]
    set months [howmanymonths $project_start $project_end]
    set rows 20

    canvas .c -width [expr {200 * $months}] -height [expr {20 * $rows}]
    pack .c

    set gantt [::Plotchart::createGanttchart .c \
      [clock format $project_start -format {%Y-%m-%d}] \
      [clock format $project_end -format {%Y-%m-%d}] 20]

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

set gantt [tareas::init "2004-02-01 00:00:00" "2004-07-01 00:00:00"]
array set t1 {
  id 3
  keynote "5.1.7"
  description "Tarea 1 por hacer"
  start "2004-02-15"
  end "2004-04-15"
}
array set t2 {
  id 4
  keynote "5.1.8"
  description "Tarea 2 por hacer"
  start "2004-05-04"
  end "2004-06-15"
}
tareas::render'task $gantt t1
tareas::render'task $gantt t2
