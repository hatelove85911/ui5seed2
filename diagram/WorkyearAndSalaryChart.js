sap.ui.define([
  'ui5seed/thirdparty/d3'
], function(d3){

  return function(){

    var options = {
      color: 'red',
      textColor: 'yellow',
      openPopover: undefined,
    }

    function styleAxis(selection){
      selection.each(function(){
        var thisSelection = d3.select(this)
        thisSelection.selectAll(".tick")
            .style({
              stroke: "grey",
            })
        thisSelection.selectAll(".domain")
          .style({
          "stroke": "grey",
          "fill": "none"
        })
      })
    }

    function diagram(selection){
      selection.each(function(data){
        var thisSelection = d3.select(this)
        
        var xScale = d3.scale.linear()
        xScale.domain([0, 20]).range([0, 500]).tickFormat(function(d){
          return ''+d
        })
        
        var yScale = d3.scale.linear()
        yScale.domain([0, 150000]).range([500, 0]).tickFormat(function(d){
          return ''+d
        })
        
        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
        
        var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
        
        var chartGroup = thisSelection.selectAll('.chart').data([1])
        chartGroup.enter().append('g').classed('chart', true)  
        chartGroup.attr('transform', 'translate(70, 0)')

        
        var xAxisGroup = chartGroup.selectAll('.xAxis').data([1])
        xAxisGroup.enter().append('g').classed('xAxis', true)  
        xAxisGroup.attr('transform', 'translate(0, 500)').call(xAxis)

        var yAxisGroup = chartGroup.selectAll('.yAxis').data([1])
        yAxisGroup.enter().append('g').classed('yAxis', true)  
        yAxisGroup.call(yAxis)

        var contentGroup = chartGroup.selectAll('.content').data([1])
        contentGroup.enter().append('g').classed('content', true)  
        
        var empUpd = contentGroup.selectAll('circle').data(data)
        empUpd.exit().remove()
        empUpd.enter().append('circle')
        empUpd.attr({
          cx: function(d){
            return xScale(d.year)
          },
          cy: function(d){
            return yScale(d.salary)
          },
          r: function(d){
            return d.salary / d.year / 500
          } 
        })
        .style({
          fill: options.color
        })
        
        var nameUpd = contentGroup.selectAll('text').data(data)
        nameUpd.exit().remove()
        nameUpd.enter().append('text')
        nameUpd.text(function(d){
          return d.name
        })
        .attr({
          x: function(d){
            return xScale(d.year)
          },
          y: function(d){
            return yScale(d.salary) - d.salary / d.year / 500
          }
        })
        .style('fill', options.textColor)
        .on('click', function(d){
          options.openPopover(this, d)
        })
        
        xAxisGroup.call(styleAxis)
        yAxisGroup.call(styleAxis)
      })

    }

    Object.keys(options).map(function(key){
      diagram[key] = function(x){
        if(!arguments.length) return options[key]
        options[key] = x
        return this
      }
    })


    return diagram
  }
})