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
  const WIDTH = 16000;
  const BAR_HEIGHT = 30;
  const BAR_WIDTH = 5;
  const X_MIN = d3.min(dataset['monthlyVariance'], (d) => d['year']);
  const X_MAX = d3.max(dataset['monthlyVariance'], (d) => d['year']);

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
}