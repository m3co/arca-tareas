
package require Plotchart

namespace eval tareas {
  variable tasks

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
      $path bind $id <Motion> [list tareas::extrude'left %W $id %x %y \
        $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x0) }]]
      return
    } elseif { $x1 - $l10 < $xcoord && $xcoord < $x1 } {
      $path bind $id <Motion> [list tareas::extrude'right %W $id %x %y \
        $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x1) }]]
      return
    } else {
      $path bind $id <Motion> [list tareas::extrude'both %W $id %x %y \
        $x0 $y0 $x1 $y1 \
        [expr { abs($xcoord - $x0) }] [expr { abs($xcoord - $x1) }]]
    }
  }

  proc end'extrude { path id task } {
    $path bind $id <Motion> {}
    puts $task
  }


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

    $canvas bind [lindex $item 1] <ButtonPress-1> [list \
      tareas::begin'extrude %W [lindex $item 1] %x %y]

    $canvas bind [lindex $item 1] <ButtonRelease-1> [list \
      tareas::end'extrude %W [lindex $item 1] $t(id)]

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
