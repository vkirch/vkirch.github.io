/**
 * KNOWN ISSUES TO FIX
 * 1.Country labels are not in the color white
 * 2.Fertility rate bars when changed move slightly from their origin position
 *
 */

/**
 * Call our functions on window load event
 */
window.onload = function(){
    setup();
}

/**
 * Global variables
 */
var _data_life;
var _data_fertility;
var _vis;   // the svg container where we will draw our visualization
var _vis_width = 0;     // dimensions of the visualization
var _vis_height = 0;

const PADDING_FOR_LABELS = 150;


/**
* Function setup: sets up our visualization environment.
* You can change the code to not have static paths and elementID's
*/
function setup(){
    loadData("life_expectancy_data_csv.csv", "fertility_rate_data_csv.csv");
    _vis = document.getElementById("vis");
    //_visD3 = d3.select("#vis");
     _vis = d3.select("#vis");
    // grab our container's dimension
    _vis_width = d3.select("#vis").node().getBoundingClientRect().width;
    _vis_height = d3.select("#vis").node().getBoundingClientRect().height;
}

/**
 * Function loadData: loads data from a given CSV file path/url
 * @param path string location of the CSV data file
 */

function loadData(path1, path2){

    Promise.all([d3.csv(path1), d3.csv(path2)]).then(function(arrValues){
            console.log(arrValues);

            _data_life = arrValues[0];
            setupLifeBars(_data_life);

            _data_fertility = arrValues[1];
            setUpFertilityBars(_data_fertility);

        //console.log(_data_life);
        //setupLifeBars();    // putting this here to make sure it gets called after the data is loaded
    });
    // d3.csv(path2).then(function(data){
      //  console.log(_data_fertility);
        //setUpFertilityBars();
    // });
/*
    if(_data_life !== null && _data_fertility !== null){
        //call set up bars function
        setupBars();
    }
*/

}

/**
 * Function setupBars: sets up rectangles to represent each data point in our dataset
 */


function setupLifeBars(_data_life) {
    console.log(_data_life);
    console.log(_vis_height);
    // divide the height of our vis to the number of rows
    var y_pad = Math.floor(_vis_height / _data_life.length);
    var spacing = 0;

    console.log(_data_life);


    var lifeBarGroup = _vis.selectAll("g.life-bar")
        .data(_data_life)
        .enter()
        .append("g")
        .attr("class", "life-bar")
        .attr("transform", "");

    lifeBarGroup
        //.selectAll("rect")
        .append("rect")
        .attr("id", function (d, i) {
            return "row_L_" + i;
        })
        .attr("x", (_vis_width / 2) * 1.20)
        .attr("y", (d, i) => i * y_pad)
        .attr("height", 50)
        .attr("width", y_pad / 1.5)
        .attr("style", "fill:#F22480; stroke-width: 1; stroke:white");



    lifeBarGroup
        .append("text")
        .text(function (d) {
            return d.Country;
        })

        .attr("y", function (d, i) {
            if (i === 0) {
                return spacing += 25;
            } else {
                return spacing += 58;
            }
        })
        .attr("x", _vis_height - PADDING_FOR_LABELS + 125)
        .attr("style", "stroke: white; text-align: center");



    /*

    */
}
    /**
     * Function setupBars: sets up rectangles to represent each data point in our dataset
     */

    function setUpFertilityBars(_data_fertility) {
        var y_pad = Math.floor(_vis_height / _data_fertility.length);

        _vis.selectAll("rect.fertility-bars")
            .data(_data_fertility)
            .enter()
            .append("rect")
            .attr("class", "fertility-bars")
            .attr("id", function (d, i) {
                return "row_F_" + i;
            })
            .attr("x", (_vis_width / 2) -175)
            .attr("y", (d, i) => i * y_pad)
            .attr("height", 50)
            .attr("width", y_pad / 1.5)
            .attr("style", "fill:#FFDC19; stroke-width: 1; stroke:white");


    }

    /**
     * Function changeBarHeights: changes the heights of the bars in our visualization with values
     * from a given data attribute
     * @param attr the data attribute containing the value to be applied to each bar's height
     * @param maxAttrValue the maximum value the attribute can have
     * assume the min value is 0
     */
    function changeBarLengthLife(attr, maxAttrValue) {
        console.log("In changing bar lengths for life data");

      /*  for (var i = 0; i < _data_life.length; i++) {
            var newLength = mapValue(_data_life[i][attr], 0, maxAttrValue, 0, (_vis_width / 2) - PADDING_FOR_LABELS);
            var bar = document.getElementById("row_L_" + i);

            var oldX = bar.getAttribute("x");
            var oldLength = bar.getAttribute("width");
            var newX = oldX;//_vis_width - PADDING_FOR_LABELS - newLength;

            bar.setAttribute("x", oldX);
            bar.setAttribute("width", oldLength);

            var animate = "<animate id='animate_bar_" + i + "' attributeName='x' from='" + oldX + "' " +
                "to='" + newX + "' dur='1s' begin='indefinite'" +
                "repeatCount='1' fill='freeze'></animate>" +
                "<animate attributeName='width' from='" + oldLength + "' to='" + newLength + "' dur='1s' " +
                "begin='animate_bar_" + i + ".begin' fill='freeze'></animate>" +
                "<title>" + _data_life[i][attr] + "</title>";
            bar.innerHTML = animate;
            document.getElementById('animate_bar_' + i).beginElement();
        }
       */


        _vis.selectAll("g.life-bar")
            .data(_data_life)
            .select("rect")
            .transition()
            .duration(1000)
            .ease(d3.easeBounce)
            .attr("width", function(d, i) {
                return mapValue(_data_life[i][attr], 0, maxAttrValue, 0, (_vis_width/2) - PADDING_FOR_LABELS);
            })
            // .attr("style", "fill:#F22480; stroke-width: 1; stroke:white");



    }

    /**
     * Function changeBarHeights: changes the heights of the bars in our visualization with values
     * from a given data attribute
     * @param attr the data attribute containing the value to be applied to each bar's height
     * @param maxAttrValue the maximum value the attribute can have
     * assume the min value is 0
     */
    function changeBarLengthFertility(attr, maxAttrValue) {
        for (var i = 0; i < _data_fertility.length; i++) {
            var newLength = mapValue(_data_fertility[i][attr], 0, maxAttrValue, 0, _vis_width / 2 - PADDING_FOR_LABELS);
            var bar = document.getElementById("row_F_" + i);

            var oldX = bar.getAttribute("x"); //- newLength; //FOR NEW FUNCTION
            var oldLength = bar.getAttribute("width");
            var newX = oldX - newLength;

            bar.setAttribute("x", oldX);
            bar.setAttribute("width", oldLength);


            var animate = "<animate id='animate_bar_" + i + "' attributeName='x' from='" + oldX + "' " +
                "to='" + oldX + "' dur='1s' begin='indefinite'" +
                "repeatCount='1' fill='freeze'></animate>" +
                "<animate attributeName='width' from='" + oldLength + "' to='" + newLength + "' dur='1s' " +
                "begin='animate_bar_" + i + ".begin' fill='freeze'></animate>" +
                "<title>" + _data_fertility[i][attr] + "</title>";
            bar.innerHTML = animate;
            document.getElementById('animate_bar_' + i).beginElement();

        }
    }


    /**
     * Function maps a value from an old range of values to a new range
     * @param value the number to be remapped to a given range
     * @param origMin the minimum value of the original range
     * @param origMax the maximum value of the original range
     * @param newMin the minimum value of the new range
     * @param newMax the maximum value of the new range
     */
    function mapValue(value, origMin, origMax, newMin, newMax) {
        return (value - origMin) * (newMax - newMin) / (origMax - origMin) + newMin;
    }
