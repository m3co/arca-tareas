
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

  array set event [list \
    query getedges \
    module Tasks \
    from Tasks \
    project 5 \
  ]
  chan puts $MAIN::chan [array get event]

}
