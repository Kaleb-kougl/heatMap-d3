const HTTP = new XMLHttpRequest();
const URL = ("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
HTTP.open("GET", URL);
HTTP.send();

let dataset;

HTTP.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
        dataset = JSON.parse(HTTP.responseText);
        // console.log(dataset);
        d3Commands();
    } else {
        console.log("something went wrong");
    }
}

function d3Commands() {
  // console.log(dataset);

  const PADDING = 20;
  const HEIGHT = 500;
  const WIDTH = 6000;
  const BAR_HEIGHT = 30;
  const BAR_WIDTH = 5;
  const X_MIN = new Date(d3.min(dataset['monthlyVariance'], (d) => d['year']), 0);
  const X_MAX = new Date(d3.max(dataset['monthlyVariance'], (d) => d['year']), 0);
  const TIME_FORMAT = d3.timeFormat("%Y")
  const X_SCALE = d3.scaleTime()
    .domain([X_MIN, X_MAX])
    .range([PADDING, WIDTH-PADDING]);
  const X_AXIS = d3.axisBottom(X_SCALE).tickFormat(TIME_FORMAT); 

  const svg = d3.select('body')
    .append('svg')
    .attr('height', HEIGHT)
    .attr('width', WIDTH);

  svg.selectAll("rect")
    .data(dataset['monthlyVariance'])
    .enter()
    .append('rect')
    .attr('x', (d, i) => {
      // console.log(d)
      return i * BAR_WIDTH})
    .attr('y', 0)
    .attr('height', BAR_HEIGHT)
    .attr('width', BAR_WIDTH)
    .style('fill', 'red')
    .attr('stroke-width', 1.5)
    .attr('stroke', 'black');

  svg.append('g')
    .attr('transform', 'translate(0,' + (HEIGHT - PADDING) + ')')
    .attr('id', 'x-axis')
    .call(X_AXIS);
}