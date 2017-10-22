var graph_width = 960;
var graph_height = 540;

function september_tests_and_vms(data) {

    // Parse the date / time
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    data.forEach(function(d) {
        d.date = parseDate(d.date);
    });

    tests_and_vms(data, "#september-tests-and-vms-1");
    tests_and_vms(data, "#september-tests-and-vms-2");
}

function tests_and_vms(data, id) {

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 80},
        width = graph_width - margin.left - margin.right,
        height = graph_height - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .ticks(5);

    // Define the line
    var testsLine = d3.svg.line()
        .interpolate("basis")           // <=== THERE IT IS!
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.tests); });

    // Define the line
    var vmsLine = d3.svg.line()
        .interpolate("basis")           // <=== THERE IT IS!
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.vms); });

    // Adds the svg canvas
    var svg = d3.select(id)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return Math.max(d.tests, d.vms); })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("class", "tests")
        .attr("data-legend", "Tests per day")
        .attr("d", testsLine(data));

    svg.append("path")
        .attr("class", "line")
        .attr("class", "vms")
        .attr("data-legend", "VMs per day")
        .attr("d", vmsLine(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // And add the legend
    /*
    legend = svg.append("g")
        .attr("class","legend")
        .attr("data-style-padding", 20)
        .attr("transform","translate(50,30)")
        .call(d3.legend);
    */
}

// zcat tests-train-1.jsonl.gz | sed -ne 's/.*ok.*duration: \([0-9]\+\)s.*/\1/p' | awk '{ printf("%i0\n", $1 / 10) }' | sort | uniq -c
function tests_duration(data) {

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 100},
        width = graph_width - margin.left - margin.right,
        height = graph_height - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        .ticks(10)
        .tickFormat(function(d) {
            var minutes = Math.floor(d / 60);
            var seconds = +((d % 60)).toFixed(0);
            return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
        });

    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .ticks(5);

    // Define the line
    var durationLine = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.duration); })
        .y(function(d) { return y(d.count); });

    // Adds the svg canvas
    var svg = d3.select(".tests-duration")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain([0, d3.max(data, function(d) { return d.count; })]);
    y.domain([0, 20000]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("class", "duration")
        .attr("d", durationLine(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}
