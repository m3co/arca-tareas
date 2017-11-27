source "patch_plotgantt.tcl"

namespace eval Tasks {
  variable tasks
  variable summaries
  variable keynotes

  proc extrude'left { path xcoord ycoord id x0 y0 x1 y1 d} {
    $path coords $id [expr { $xcoord - $d }] $y0 $x1 $y1
  }
  proc extrude'right { path id xcoord ycoord x0 y0 x1 y1 d} {
    $path coords $id $x0 $y0 [expr { $xcoord + $d }] $y1
  }
  proc extrude'both { path id xcoord ycoord x0 y0 x1 y1 d1 d2} {
    $path coords $id [expr { $xcoord - $d1 }] $y0 [expr { $xcoord + $d2 }] $y1
  }
  proc private'move'red { path id xcoord0 ycoord0 xcoord ycoord \
    x0 y0 x1 y1 } {
    set d1 [expr { $xcoord - $xcoord0 }]
    $path coords $id [expr { $x0 + $d1 }] $y0 [expr { $x1 + $d1 }] $y1
  }

  proc redraw'task { path gantt id } {
    variable tasks

    set task [dict get $tasks($id) task]
    set tag_task [lindex $task 1]

    set start [clock scan [dict get $tasks($id) payload start] -format "%Y-%m-%d"]
    set end [clock scan [dict get $tasks($id) payload end] -format "%Y-%m-%d"]

    set coords [$path coords $tag_task]

    set pxmin $Plotchart::scaling($path,pxmin)
    set pxmax $Plotchart::scaling($path,pxmax)

    set xmin $Plotchart::scaling($path,xmin)
    set xmax $Plotchart::scaling($path,xmax)

    set pxl [expr { $pxmax - $pxmin }]
    set xl [expr { $xmax - $xmin }]

    set pxstart [expr { entier($pxmin + ($pxl * ($start - $xmin) / $xl)) }]
    set pxend [expr { entier($pxmin + ($pxl * ($end - $xmin) / $xl)) }]

    $path coords $tag_task $pxstart [lindex $coords 1] $pxend [lindex $coords 3]

    set coords [$path coords [lindex $task 2]]
    $path coords [lindex $task 2] $pxend [lindex $coords 1] \
      [expr { 5 + $pxend }] [lindex $coords 3]

    set keynote [dict get $tasks($id) payload keynote]
    set description [dict get $tasks($id) payload description]
    $path itemconfigure [lindex $task 0] -text "$keynote $description"

    redraw'connections $path $gantt $id
  }

  proc redraw'connections { path gantt taskid } {
    variable tasks
    set connector $tasks($taskid)
    if { [dict exists $connector connectedWith] == 1} {
      foreach connection [dict get $connector connectedWith] {
        redraw'connections $path $gantt $connection
      }
    }
    if { [dict exists $connector payload connectwith] == 0 } {
      return
    }
    set connected $tasks([dict get $connector payload connectwith])

    $path delete [dict get $connector arrow]
    set connection [$gantt connect \
      [dict get $connector task] [dict get $connected task]]
    dict set tasks($taskid) arrow $connection
    dict set tasks([dict get $connector payload connectwith]) arrow $connection
  }

  proc private'move'right { path xcoord0 ycoord0 xcoord ycoord \
    id x0 y0 x1 y1 d1 \
    id1 x01 y01 x11 y11 } {
    [namespace current]::extrude'right $path \
      $id $xcoord $ycoord \
      $x0  $y0  $x1  $y1  $d1
    [namespace current]::private'move'red $path \
      $id1 $xcoord0 $ycoord0 $xcoord $ycoord \
      $x01 $y01 $x11 $y11
  }

  proc private'move'both { path xcoord0 ycoord0 xcoord ycoord \
    id x0 y0 x1 y1 d1 d2 \
    id1 x01 y01 x11 y11 } {
    [namespace current]::extrude'both $path \
      $id $xcoord $ycoord \
      $x0  $y0  $x1  $y1  $d1 $d2
    [namespace current]::private'move'red $path \
      $id1 $xcoord0 $ycoord0 $xcoord $ycoord \
      $x01 $y01 $x11 $y11
  }

  proc connect'tasks { path gantt connector connected } {
    variable tasks

    set ctor $tasks($connector)
    set cted $tasks($connected)

    if { [dict exists $ctor payload connectwith] == 1 } {
      $path delete [dict get $ctor arrow]
      set oldcted [dict get $tasks([dict get $ctor payload connectwith])]
      set oldctedwith [dict get $oldcted connectedWith]
      lremove oldctedwith $connector
      dict set tasks([dict get $ctor payload connectwith]) \
        connectedWith $oldctedwith
    }
    set connection [$gantt connect [dict get $ctor task] [dict get $cted task]]
    dict set tasks($connector) payload connectwith $connected
    dict set tasks($connector) arrow $connection

    set connections [list]
    if { [dict exists $tasks($connected) connectedWith] == 1 } {
      set connections [dict get $tasks($connected) connectedWith]
    }
    lappend connections $connector
    dict set tasks($connected) connectedWith $connections
    event generate $path <<UpdateTask>> -data $connected
  }

  proc begin'extrude { path gantt id id1 task xcoord ycoord } {
    set rect [$path coords $id]
    set x0 [lindex $rect 0]
    set y0 [lindex $rect 1]
    set x1 [lindex $rect 2]
    set y1 [lindex $rect 3]
    set l [expr { abs($x1 - $x0) }]
    set l10 [expr { $l * 0.1 }]

    set rect1 [$path coords $id1]
    set x01 [lindex $rect1 0]
    set y01 [lindex $rect1 1]
    set x11 [lindex $rect1 2]
    set y11 [lindex $rect1 3]

    variable beginConnect
    if { $beginConnect != "" } {
      connect'tasks $path $gantt $beginConnect $task
    }
    if { $x0 < $xcoord && $xcoord < $x0 + $l10 } {
      $path bind $id <Motion> [list [namespace current]::extrude'left %W %x %y \
        $id $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x0) }]]
      $path bind $id <Motion> [list +[namespace current]::inform'motion \
        %W $gantt $id $id1 $task]
      return
    } elseif { $x1 - $l10 < $xcoord && $xcoord < $x1 } {
      $path bind $id <Motion> [list [namespace current]::private'move'right %W \
        $xcoord $ycoord %x %y \
        $id $x0 $y0 $x1 $y1 [expr { abs($xcoord - $x1) }] \
        $id1 $x01 $y01 $x11 $y11]
      $path bind $id <Motion> [list +[namespace current]::inform'motion \
        %W $gantt $id $id1 $task]
      return
    } else {
      $path bind $id <Motion> [list [namespace current]::private'move'both %W \
        $xcoord $ycoord %x %y \
        $id $x0 $y0 $x1 $y1 \
        [expr { abs($xcoord - $x0) }] [expr { abs($xcoord - $x1) }] \
        $id1 $x01 $y01 $x11 $y11]
      $path bind $id <Motion> [list +[namespace current]::inform'motion \
        %W $gantt $id $id1 $task]
      return
    }
  }

  variable lastmotion
  array set lastmotion { path "" id "" id1 "" }
  proc inform'motion { path gantt id id1 taskid } {
    variable lastmotion
    array set lastmotion [list \
      path $path \
      id $id \
      id1 $id1 \
    ]
    redraw'connections $path $gantt $taskid
  }

  proc end'extrude { path id id1 task } {
    variable tasks
    variable lastmotion

    $path bind $id <Motion> {}
    if { "$lastmotion(path) $lastmotion(id) $lastmotion(id1)" == \
          "$path $id $id1" } {
      array set lastmotion { path "" id "" id1 "" }
    } else {
      return
    }

    set coords [$path coords $id]
    set pxstart [lindex $coords 0]
    set pxend [lindex $coords 2]

    set pxmin $Plotchart::scaling($path,pxmin)
    set pxmax $Plotchart::scaling($path,pxmax)

    set xmin $Plotchart::scaling($path,xmin)
    set xmax $Plotchart::scaling($path,xmax)

    set pxl [expr { $pxmax - $pxmin }]
    set xl [expr { $xmax - $xmin }]

    set xstart [expr { entier($xmin + (($pxstart - $pxmin) / $pxl)*$xl) }]
    set xend [expr { entier($xmin + (($pxend - $pxmin) / $pxl)*$xl) }]

    set payload [dict get $tasks($task) payload]
    dict set payload start [clock format $xstart -format {%Y-%m-%d}]
    dict set payload end [clock format $xend -format {%Y-%m-%d}]

    dict set tasks($task) payload $payload
    # aqui debo poner un evento que diga que la tarea fue actualizada...
    event generate $path <<UpdateTask>> -data $task
  }

  proc render'connections { gantt } {
    variable tasks
    foreach id [array names tasks] {
      set task $tasks($id)
      if { [dict exists $task payload connectwith] } {
        set connectwith [dict get $task payload connectwith]
        set from [dict get $task task]
        set to [dict get $tasks($connectwith) task]
        set arrow [$gantt connect $from $to]
        dict set tasks($id) arrow $arrow
        dict set tasks($connectwith) arrow $arrow

        set connections [list]
        if { [dict exists tasks($connectwith) connectedWith] == 1 } {
          lappend connections [dict get tasks($connectwith) connectedWith]
        }
        lappend connections $id
        dict set tasks($connectwith) connectedWith $connections
      }
    }
  }

  variable beginConnect ""
  proc begin'connect { path id id1 task } {
    variable beginConnect $task
    variable tasks

    set ctor $tasks($task)
    if { [dict exists $ctor payload connectwith] == 1 } {
      $path delete [dict get $ctor arrow]
      set oldcted [dict get $tasks([dict get $ctor payload connectwith])]
      set oldctedwith [dict get $oldcted connectedWith]
      lremove oldctedwith $task
      dict set tasks([dict get $ctor payload connectwith]) \
        connectedWith $oldctedwith
      dict unset tasks($task) payload connectwith
      event generate $path <<UpdateTask>> -data $task
    }

    after 100 {
      bind . <ButtonPress-1> {
        bind . <ButtonPress-1> {}
        bind . <ButtonRelease-1> {
          bind . <ButtonRelease-1> {}
          set Tasks::beginConnect ""
        }
      }
    }
  }

  proc render'summaries { gantt } {
    variable tasks
    variable summaries
    variable keynotes

    set path [string range $gantt 11 end]
    foreach s [lsort -decreasing [array names summaries]] {
      set i $s
      set s $summaries($s)
      set keynote [dict get $s payload keynote]
      set filtred [list]
      set pos [expr { entier([dict get $s current]) + 2}]
      set cmd "::Plotchart::DrawGanttSummaryModified $path"
      append cmd " $pos "
      append cmd "\""
      append cmd "[dict get $s payload keynote] [dict get $s payload description]"
      append cmd "\""
      foreach d [array names keynotes -regexp "$keynote\[.\]"] {
        if { [array names tasks -exact $keynotes($d)] != "" } {
          append cmd " {"
          append cmd [dict get $tasks($keynotes($d)) task]
          append cmd "}"
        }
      }
      set summaryimage [eval $cmd]
      dict set summaries($i) summaryimage $summaryimage
    }
  }

  proc render'summary { gantt summary } {
    variable tasks
    variable summaries
    upvar $summary s_

    set path [string range $gantt 11 end]
    set c1 [expr { entier($Plotchart::scaling($path,xmin)) }]
    set c2 [expr { entier($c1 + 1) }]

    set c1_ [clock format $c1 -format {%Y-%m-%d}]
    set c2_ [clock format $c2 -format {%Y-%m-%d}]

    array set s_ [list \
      start $c1_ \
      end $c2_ \
    ]
    set task_ [render'task $gantt s_]
    set i 0
    foreach d [dict get $task_ task] {
      incr i
      if { $i == 1 } {
        $path itemconfigure $d -anchor w -tag {summary vertscroll above} \
         -font $::Plotchart::settings($path,font,summary)
        set summaries($s_(id)) [list \
          payload [array get s_] \
          current $Plotchart::scaling($path,current) \
          summarytext $d
        ]
        continue
      }
      $path delete $d
    }

    array unset tasks $s_(id)
  }

  proc render'task { gantt task } {
    upvar $task t
    variable tasks
    variable keynotes

    set keynotes($t(keynote)) $t(id)
    set canvas [string range $gantt 11 end]
    set item [$gantt task "$t(keynote) $t(description)" $t(start) $t(end) 100]

    $canvas itemconfigure [lindex $item 3] -text {}

    set coords [$canvas coords [lindex $item 2]]
    $canvas coords [lindex $item 2] [lindex $coords 0] [lindex $coords 1] \
      [expr { 5 + [lindex $coords 2] }] [lindex $coords 3]

    $canvas itemconfigure [lindex $item 2] -fill red

    $canvas bind [lindex $item 1] <ButtonPress-1> [list \
      [namespace current]::begin'extrude %W $gantt \
      [lindex $item 1] [lindex $item 2] $t(id) %x %y]

    $canvas bind [lindex $item 1] <ButtonRelease-1> [list \
      [namespace current]::end'extrude %W [lindex $item 1] [lindex $item 2] $t(id)]

    $canvas bind [lindex $item 2] <ButtonPress-1> [list \
      [namespace current]::begin'connect %W \
      [lindex $item 1] [lindex $item 2] $t(id)]

    array set internal {}
    set internal(payload) [array get t]
    set internal(task) $item
    set tasks($t(id)) [array get internal]
  }

  proc 'do'select { resp } {
    upvar $resp response
    variable gantt
    array set row [deserialize $response(row)]

    array set task [list \
      id $row(id) \
      keynote $row(keynote) \
      parent $row(parent) \
      description $row(description) \
    ]
    if { $row(expand) == t } {
      array set task [list \
        expand 1 \
      ]
      Tasks::render'summary $gantt task
    } else {
      array set task [list \
        start $row(start) \
        end $row(end) \
        expand 0 \
      ]
      if { $row(connectwith) != "" } {
        set task(connectwith) $row(connectwith)
      }
      Tasks::render'task $gantt task
    }
  }

  proc 'do'getedges { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]

    set path $MAIN::frame.c
    variable gantt [Tasks::init $path $row(start) $row(end) $row(rows)]
    pack $path
  }

  proc 'do'finish'select { resp } {
    variable gantt
    Tasks::render'summaries $gantt
    Tasks::render'connections $gantt
  }

  proc updatetask { path gantt taskid } {
    variable tasks
    array set container [deserialize $tasks($taskid)]
    array set payload [deserialize $container(payload)]
    set task $container(task)
    puts $task
    parray payload
    puts "$path - $gantt - $taskid"
  }

  proc init { path start end l } {
    set start_ [clock add [clock scan $start -format {%Y-%m-%d}] -1 week]
    set end_ [clock add [clock scan $end -format {%Y-%m-%d}] 1 week]

    set project_start $start_
    set project_end $end_
    set months [howmanymonths $project_start $project_end]
    set rh 22

    if { [winfo exists $path] == 1 } {
      $path configure -width [expr {200 * $months}] -height [expr {$rh * $l}]
    } else {
      canvas $path -width [expr {200 * $months}] -height [expr {$rh * $l}]
    }

    set gantt [::Plotchart::createGanttchart $path \
      [clock format $project_start -format {%Y-%m-%d}] \
      [clock format $project_end -format {%Y-%m-%d}] $l]

    set current_time $project_start
    while { $current_time < $project_end } {
      $gantt vertline [clock format $current_time -format {%d %b}] \
        [clock format $current_time -format {%d %B %Y}]
      set current_time [clock add $current_time 1 months]
    }

    $gantt title "Administrador de tiempos (version inicial)"
    bind $path <<UpdateTask>> [list \
      [namespace current]::updatetask %W $gantt %d]

    array set event [list \
      query select \
      module Tasks \
      from Tasks \
      project 5 \
    ]
    chan puts $MAIN::chan [array get event]

    return $gantt
  }
}
