
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
puts " aja ? "
proc ::Plotchart::DrawGanttSummaryModified { w ypos text args } {
    puts "Ok ok... here we go..."
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
    puts "$yfirst --- "
    puts $yfirst
    set ynext  [expr {$yfirst-1.0}]
    foreach {x y1} [coordsToPixel $w $scaling($w,xmin) $yfirst] {break}
    foreach {x y2} [coordsToPixel $w $scaling($w,xmin) $ynext ] {break}
    set ymin $y2
    set yminb $y1
    puts "$y1 -- $y2"
    set dy [expr {$y2-$y1}]


    #
    # Draw the summary text first
    #
    set ytext [expr {($ymin+$yminb)/2.0}]
    set ymin  [expr {$ymin+0.3*$dy}]

    set items {}
    lappend items \
        [$w create text 5 $ytext -text $text -anchor w -tag {summary vertscroll above} \
              -font $settings($w,font,summary)]
        # Colour text?

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

    set scaling($w,current) [expr {$scaling($w,current)-1.0}]

    ReorderChartItems $w

    return $items
}
