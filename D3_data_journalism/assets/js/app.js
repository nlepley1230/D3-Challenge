// @TODO: YOUR CODE HERE!
var svgWidth = 700;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV 
d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;
    // console.log(healthData);

    // Parse Data/Cast as numbers
    
    healthData.forEach(function(data) {
        data.smoke = +data.smoke;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare
    });

    // Create scale functions
   
    var xLinearScale = d3.scaleLinear()
        .domain([9, d3.max(healthData, d => d.poverty)])
        .range([0, width]);
    console.log(d3.extent(healthData, d => d.poverty));    
    

    var yLinearScale = d3.scaleLinear()
        .domain([9, d3.max(healthData, d => d.smokes) * 2.9])
        .range([height, 0]);
    console.log(d3.extent(healthData, d => d.smokes));

    // Create axis functions
   
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Create Circles
   
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        // .attr("class", "stateCircle")
        .attr("r", "8")
        .attr("fill", "dodgerblue")
        .attr("opactity", ".5")

    // Add state lables to circles
    var circlesLables = chartGroup.selectAll()
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.smokes) + 3)
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => d.abbr);

    //  Initialize tool tip
    
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>% of Smokers: ${d.smokes}<br>% in Poverty: ${d.poverty}`);
      });

    // Create tooltip in the chart
   
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smoking Rate");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% In Poverty");
  }).catch(function(error) {
    console.log(error);

});