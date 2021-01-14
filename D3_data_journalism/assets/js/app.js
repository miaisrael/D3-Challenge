// Step 1: Set up the chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold the chart,
// shift the latter by left and top margins,
// and append a div to the body to create tooltips, assign it a class.
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Step 3:
// Import data from the csv file
// =================================
d3.csv("data/data.csv").then(function(projectData) {

  // Step 4: Format the data
  // =================================
  projectData.forEach(function(data) {
    data.poverty= +data.poverty;
    data.obesity= +data.obesity;

    console.log(data);
  });

  // Step 5: Create Scales
  //= ============================================
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(projectData, d => d.poverty)])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(projectData, d => d.obesity)])
    .range([height, 0]);

  // Step 6: Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);


  // Step 7: Append the axes to the chartGroup
  // ==============================================
  // Add bottomAxis
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g").call(leftAxis);


  // Step 8: Generate the scatter plot and circles
  // ==============================================
chartGroup.selectAll("circle")
.data(projectData)
.enter()
.append("circle")
.attr("cx", d=>xScale(d.poverty))
.attr("cy", d=>yScale(d.obesity))
.attr("r", "10")
.attr("stroke-width", "1")
.classed("stateCircle", true)
.attr("opacity", 0.75);

// Step 9: Add state abbreviations to each plot point
//===================================================
chartGroup.append("g")
  .selectAll('text')
  .data(projectData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xScale(d.poverty))
  .attr("y",d=>yScale(d.obesity))
  .classed(".stateText", true)
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .attr("font-size", "10px")
  .style("font-weight", "bold")
  .attr("alignment-baseline", "central");
  

 // Step 10: Add state abbreviations to each plot point
 //===================================================
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 13})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .style("font-weight", "bold")
    .text("Median Age");

    chartGroup.append("text")
    .attr("y", 0 - ((margin.left / 2) + 2))
    .attr("x", 0 - (height / 2))
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .style("font-weight", "bold")
    .attr("transform", "rotate(-90)")
    .text("Smokers (%)");

}).catch(function(error) {
  console.log(error);
});

