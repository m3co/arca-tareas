
package require BWidget
package require Plotchart
source [file join [file dirname [info script]] "m3co/main.tcl"]
source [file join [file dirname [info script]] "m3gantt.tcl"]

namespace eval MAIN {
  connect [namespace current]
  wm title . "Administrador de Tareas"
  wm geometry . "800x600+100+10"

  # Configure el Layout inicial
  set main [ScrolledWindow .scrolledwindow]
  pack $main -fill both -expand true
  $main setwidget [ScrollableFrame $main.scrollableframe]
  set frame [$main.scrollableframe getframe]
  update

  array set event [list \
    query getedges \
    module Tasks \
    from Tasks \
    project 5 \
  ]
  chan puts $MAIN::chan [array get event]

}
