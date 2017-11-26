
package require BWidget
package require Plotchart
source "m3co/main.tcl"
source "m3gantt.tcl"

namespace eval MAIN {
  connect [namespace current]
  wm title . "Administrador de Insumos"
  wm geometry . "800x600+100+10"

  # Configure el Layout inicial
  set main [ScrolledWindow .scrolledwindow]
  pack $main -fill both -expand true
  $main setwidget [ScrollableFrame $main.scrollableframe]
  set frame [$main.scrollableframe getframe]
  update

  proc subscribe { } {
    variable chan

    array set event {
      module fnSuppliesByLevel1
      query subscribe
    }
    chan puts $chan [array get event]

    array set event {
      module Projects
      query subscribe
    }
    chan puts $chan [array get event]
  }
  subscribe


array set t0 {
  id 1
  keynote "5"
  description "Projecto 5"
  expand 1
}
array set t1 {
  id 2
  keynote "5.1"
  description "Preliminares"
  expand 1
}
array set t2 {
  id 55
  keynote "5.1.7"
  description "Tarea 1 por hacer"
  start "2004-02-05"
  end "2004-02-25"
  connectWith 4
  expand 0
}
array set t3 {
  id 4
  keynote "5.1.8"
  description "Tarea 2 por hacer"
  start "2004-03-04"
  end "2004-03-15"
  expand 0
}

array set t4 {
  id 5
  keynote "5.2"
  description "Cimentaciones"
  expand 1
}
array set t6 {
  id 16
  keynote "5.2.9"
  description "Tarea 3 por hacer"
  start "2004-04-04"
  end "2004-05-15"
  connectWith 7
  expand 0
}
array set t7 {
  id 7
  keynote "5.2.10"
  description "Tarea 4 por hacer"
  start "2004-05-04"
  end "2004-06-15"
  expand 0
}

set path $frame.c
set gantt [Tasks::init $path "2004-02-01 00:00:00" "2004-07-01 00:00:00" 10]
pack $path

Tasks::render'summary $gantt t0
Tasks::render'summary $gantt t1

Tasks::render'task $gantt t2
Tasks::render'task $gantt t3

Tasks::render'summary $gantt t4

Tasks::render'task $gantt t6
Tasks::render'task $gantt t7


Tasks::render'connections $gantt
Tasks::render'summaries $gantt
bind $path <<UpdateTask>> [list muestremelo %W $gantt %d]

#$gantt connect [list 0 [lindex $sumario1 1] [lindex $sumario1 1] 0] \
#  [list 0 [lindex $sumario2 1] [lindex $sumario2 1] 0]

#parray Tasks::tasks

proc muestremelo { path gantt id } {
  puts $Tasks::tasks($id)
}


}
