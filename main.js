const HTTP = new XMLHttpRequest();
const URL = ("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
HTTP.open("GET", URL);
HTTP.send();

let dataset;

HTTP.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
        dataset = JSON.parse(HTTP.responseText);
        console.log(dataset);
        d3Commands();
    } else {
        console.log("something went wrong");
    }
}

function d3Commands() {
  // CONSTANTS
  const PADDING = 55;
  const BAR_HEIGHT = 30;
  const BAR_WIDTH = 5;
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const WIDTH = PADDING + (Math.ceil(dataset['monthlyVariance'].length / 12) * BAR_WIDTH) + PADDING;
  const HEIGHT = PADDING + (BAR_HEIGHT * 12) + PADDING;
  // X-AXIS
  const X_MIN = new Date(d3.min(dataset['monthlyVariance'], (d) => d['year']), 0);
  const X_MAX = new Date(d3.max(dataset['monthlyVariance'], (d) => d['year']), 0);
  const TIME_FORMAT = d3.timeFormat("%Y")
  const X_SCALE = d3.scaleTime()
    .domain([X_MIN, X_MAX])
    .range([PADDING, WIDTH-PADDING]);
  const X_AXIS = d3.axisBottom(X_SCALE).tickFormat(TIME_FORMAT);
  // Y-AXIS
  const Y_MIN = new Date(0, d3.min(dataset['monthlyVariance'], (d) => d['month'] - 1));
  const Y_MAX = new Date(0, d3.max(dataset['monthlyVariance'], (d) => d['month'] - 1));
  const MONTH_FORMAT = d3.timeFormat("%B");
  const Y_SCALE = d3.scaleTime()
    .domain([Y_MIN, Y_MAX])
    .range([PADDING, HEIGHT-PADDING]);
  const Y_AXIS = d3.axisLeft(Y_SCALE).tickFormat(MONTH_FORMAT);

  // SVG
  const svg = d3.select('body')
    .append('svg')
    .attr('height', HEIGHT)
    .attr('width', WIDTH);

  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .attr('opacity', 0);

    // RENDER RECTS
  svg.selectAll("rect")
    .data(dataset['monthlyVariance'])
    .enter()
    .append('rect')
    .attr('x', (d, i) => X_SCALE(new Date(d['year'], 0)))
    .attr('y', (d, i) => Y_SCALE(new Date(0, d['month'] - 1)))
    .attr('height', BAR_HEIGHT)
    .attr('width', BAR_WIDTH)
    .style("margin-top", "0px")
    .style('fill', (d, i) => determineColor(d))
    .on('mouseover', function(d, i) {
      tooltip.transition()
        .duration(0)
        .style('opacity', 0.9);
      tooltip.html(d['year'] + ' - ' + (MONTHS[(d['month']) - 1]) + '<br>' + 
      (dataset['baseTemperature'] - d['variance']).toFixed(2) + '&#8451;' + '<br>'
      + (d['variance']).toFixed(2) + '&#8451;')
        .style('left', (d3.event.pageX) + 10 + 'px')
        .style('top', (d3.event.pageY) + 'px')
    })
    .on('mousout', function(d, i) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    })
    ;

    // X-AXIS
  svg.append('g')
    .attr('transform', 'translate(0,' + (HEIGHT - PADDING + BAR_HEIGHT) + ')')
    .attr('id', 'x-axis')
    .call(X_AXIS);

    // Y-AXIS
  svg.append('g')
    .attr('transform', 'translate(' + (PADDING) + ',' + (BAR_HEIGHT / 2) + ')')
    .attr('id', 'y-axis')
    .call(Y_AXIS);
}


function determineColor(data) {
  if (data['variance'] <= -5.86) {
    return 'rgb(50, 57, 147)';
  } else if (data['variance'] <= -4.76 && data['variance'] > -5.86){
    return 'rgb(71, 118, 178)';
  } else if (data['variance'] <= -3.66 && data['variance'] > -4.76){
    return 'rgb(118, 173, 207)';
  } else if (data['variance'] <= -2.56 && data['variance'] > -3.66){
    return 'rgb(172, 217, 232)';
  } else if (data['variance'] <= -1.46 && data['variance'] > -2.56){
    return 'rgb(224, 243, 248)';
  } else if (data['variance'] <= -0.36 && data['variance'] > -1.46){
    return 'rgb(255, 254, 194)';
  } else if (data['variance'] <= 0.84 && data['variance'] > -0.36){
    return 'rgb(253, 223, 149)';
  } else if (data['variance'] <= 1.94 && data['variance'] > 0.84) {
    return 'rgb(251, 173, 104)';
  } else if (data['variance'] <= 3.04 && data['variance'] > 1.94) {
    return 'rgb(242, 110, 74)';
  } else if (data['variance'] <= 4.14 && data['variance'] > 3.04) {
    return 'rgb(212, 50, 46)';
  } else if (data['variance'] > 4.14){
    return 'rgb(163, 6, 41)';
  } else {
    return 'rgb(255, 255, 255)';
  }
}