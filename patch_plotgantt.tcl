
# DrawGanttSummary --
#    Draw a summary entry
# Arguments:
#    w           Name of the canvas
#    text        Text to describe the summary
#    args        List of items belonging to the summary
# Result:
#    List of canvas items making up the summary
# Side effects:
#    Items are shifted down to make room for the summary
#
proc ::Plotchart::DrawGanttSummaryModified { w ypos text args } {
    variable settings
    variable data_series
    variable scaling

    #
    # Determine the coordinates of the summary bar
    #
    set xmin {}
    set xmax {}
    set ymin {}
    set ymax {}
    foreach entry $args {
        foreach {x1 y1}             [$w coords [lindex $entry 1]] {break}
        foreach {dummy dummy x2 y2} [$w coords [lindex $entry 2]] {break}

        if { $xmin == {} || $xmin > $x1 } { set xmin $x1 }
        if { $xmax == {} || $xmax < $x2 } { set xmax $x2 }
        if { $ymin == {} || $ymin > $y1 } {
            set ymin  $y1
            set yminb $y2
        }
    }

    #
    # Compute the vertical shift
    #
    set yfirst $ypos
    set ynext  [expr {$yfirst-1.0}]
    foreach {x y1} [coordsToPixel $w $scaling($w,xmin) $yfirst] {break}
    foreach {x y2} [coordsToPixel $w $scaling($w,xmin) $ynext ] {break}
    set ymin [expr { $y2 - 15*0 }]
    set yminb [expr { $y1 - 15*0 }]
    set dy [expr {$y2-$y1}]


    #
    # Draw the summary text first
    #
    set ytext [expr {($ymin+$yminb)/2.0}]
    set ymin  [expr {$ymin+0.3*$dy}]

    set items {}

    #
    # Draw the bar
    #
    set coords [list [expr {$xmin-5}] [expr {$ymin-5}]  \
                     [expr {$xmax+5}] [expr {$ymin-5}]  \
                     [expr {$xmax+5}] [expr {$ymin+5}]  \
                     $xmax            [expr {$ymin+10}] \
                     [expr {$xmax-5}] [expr {$ymin+5}]  \
                     [expr {$xmin+5}] [expr {$ymin+5}]  \
                     $xmin            [expr {$ymin+10}] \
                     [expr {$xmin-5}] [expr {$ymin+5}]  ]

    lappend items \
        [$w create polygon $coords -tag {summarybar vertscroll horizscroll below} \
              -fill $settings($w,color,summarybar)]

    #set scaling($w,current) [expr {$scaling($w,current)-1.0}]

    #ReorderChartItems $w

    return $items
}
