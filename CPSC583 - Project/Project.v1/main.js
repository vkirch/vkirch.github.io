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
    // or _vis = d3.select("#vis");
    // grab our container's dimension
    _vis_width = d3.select("#vis").node().getBoundingClientRect().width;
    _vis_height = d3.select("#vis").node().getBoundingClientRect().height;
}

/**
 * Function loadData: loads data from a given CSV file path/url
 * @param path string location of the CSV data file
 */
function loadData(path1, path2){

    if(path1 === "life_expectancy_data_csv.csv"){
        console.log("Dealing with life expectancy data");

        // call D3's loading function for CSV and load the data to our global variable _data
        d3.csv(path1).then(function(data){
            _data_life = data;
            setupLifeBars();    // putting this here to make sure it gets called after the data is loaded
        });
    }
    if(path2 === "fertility_rate_data_csv.csv"){
        console.log("Dealing with fertility rate data");
        d3.csv(path2).then(function(data){
            _data_fertility = data;
            setUpFertilityBars();
        });
    }

}

/**
 * Function setupBars: sets up rectangles to represent each data point in our dataset
 */

function setupLifeBars()
{
    // divide the height of our vis to the number of rows
    var y_pad = Math.floor(_vis_height / (_data_life.length));

    // for each item in our dataset, create a row on the y-axis and label it
    for (var i = 0; i < (_data_life.length); i++){
        // create a string that follows the HTML tag for drawing a rectangle
        // e.g., <rect x='0' y='0' width='100' height='100' style='fill:black; strokewidth:0;'></rect>
        // the rectangle's ID should match an index within our data (e.g., row_0 corresponds to _data[0])
        // default height is the height of the visualization - some padding for labels
        var rect = "<rect id='row_L_" + i + "' x='" + (_vis_width/2)*1.20 +"' y=" + i * y_pad + " width='" + (y_pad / 1.5) + "' height='" +
            50 + "' style='fill:#F22480; stroke-width: 1; stroke:white;'></rect>";

        //append the line within the SVG container element
        _vis.innerHTML += rect;


        // create labels using the Country name (Capitalize this because it's capitalized in our CSV file)
        if(i === 0){
            var label = "<text y='" + (i+15) + "' x='" + (_vis_height - PADDING_FOR_LABELS + 200) + "' " + "style='color: white;'>" +
                _data_life[i].Country + "</text>";
        }
        else {
            var label = "<text y='" + i * 61 + "' x='" + (_vis_height - PADDING_FOR_LABELS + 200) + "' " + "style='color: white;'>" +
                _data_life[i].Country + "</text>";
        }

        //append the label within the SVG container element
        _vis.innerHTML += label;

    }
}

/**
 * Function setupBars: sets up rectangles to represent each data point in our dataset
 */

function setUpFertilityBars()
{
    // divide the height of our vis to the number of rows
    var y_pad = Math.floor(_vis_height / (_data_fertility.length));

    // for each item in our dataset, create a row on the y-axis and label it
    for (var i = 0; i < (_data_fertility.length); i++){
        // create a string that follows the HTML tag for drawing a rectangle
        // e.g., <rect x='0' y='0' width='100' height='100' style='fill:black; strokewidth:0;'></rect>
        // the rectangle's ID should match an index within our data (e.g., row_0 corresponds to _data[0])
        // default height is the height of the visualization - some padding for labels
        var rect = "<rect id='row_F_" + i + "' x='" + ((_vis_width/2)-PADDING_FOR_LABELS) +"' y='" + i * y_pad + "' width='" + (y_pad / 1.5)  + "' height='" +
            50 + "' style='fill:#FFDC19; stroke-width: 1; stroke:white;'></rect>";

        //append the line within the SVG container element
        _vis.innerHTML += rect;

    }
}

/**
 * Function changeBarHeights: changes the heights of the bars in our visualization with values
 * from a given data attribute
 * @param attr the data attribute containing the value to be applied to each bar's height
 * @param maxAttrValue the maximum value the attribute can have
 * assume the min value is 0
 */
function changeBarLengthLife(attr, maxAttrValue){
    console.log("In changing bar lengths for life data");
    for (var i = 0; i < _data_life.length; i++){
        var newLength = mapValue(_data_life[i][attr], 0, maxAttrValue, _vis_width/2, (_vis_width/3) - PADDING_FOR_LABELS);
        var bar = document.getElementById("row_L_" + i);

        var oldX = bar.getAttribute("x") ;
        var oldLength = bar.getAttribute("width");
        var newX = oldX;//_vis_width - PADDING_FOR_LABELS - newLength;

        bar.setAttribute("x", oldX);
        bar.setAttribute("width", oldLength);

        var animate = "<animate id='animate_bar_" + i + "' attributeName='x' from='" + oldX + "' " +
            "to='" + newX + "' dur='1s' begin='indefinite'" +
            "repeatCount='1' fill='freeze'></animate>" +
            "<animate attributeName='width' from='"+ oldLength +"' to='"+ newLength +"' dur='1s' " +
            "begin='animate_bar_"+ i +".begin' fill='freeze'></animate>" +
            "<title>"+ _data_life[i][attr] +"</title>";
        bar.innerHTML = animate;
        document.getElementById('animate_bar_' + i).beginElement();
    }
}

/**
 * Function changeBarHeights: changes the heights of the bars in our visualization with values
 * from a given data attribute
 * @param attr the data attribute containing the value to be applied to each bar's height
 * @param maxAttrValue the maximum value the attribute can have
 * assume the min value is 0
 */
function changeBarLengthFertility(attr, maxAttrValue){
    for (var i = 0; i < _data_fertility.length; i++){
        var newLength = mapValue(_data_fertility[i][attr], 0, maxAttrValue, 0, _vis_width/3 - PADDING_FOR_LABELS);
        newLength = -1*newLength;
        console.log(newLength);
        var bar = document.getElementById("row_F_" + i);

        var oldX = bar.getAttribute("x"); //- newLength; //FOR NEW FUNCTION
        var oldLength = bar.getAttribute("width");
        var newX = oldX;

        bar.setAttribute("x", oldX);
        bar.setAttribute("width", oldLength);
        

        var animate = "<animate id='animate_bar_" + i + "' attributeName='x' from='" + oldX + "' " +
            "to='" + newX + "' dur='1s' begin='indefinite'" +
            "repeatCount='1' fill='freeze'></animate>" +
            "<animate attributeName='width' from='"+ oldLength +"' to='"+ newLength +"' dur='1s' " +
            "begin='animate_bar_"+ i +".begin' fill='freeze'></animate>" +
            "<title>"+ _data_fertility[i][attr] +"</title>";
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
function mapValue(value, origMin, origMax, newMin, newMax){
    return (value - origMin) * (newMax - newMin) / (origMax - origMin) + newMin;
}
