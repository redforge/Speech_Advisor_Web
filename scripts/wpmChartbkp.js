
var DELAY = 250; // delay in ms to add new data points

// create a graph2d with an (currently empty) dataset
var container = document.getElementById('visualization');
var dataset = new vis.DataSet();
var groups = new vis.DataSet();

var groupData = {
  id: 0,
  content: "Group Name",
  style: 'stroke: black; stroke-width: 10px; stroke-linecap: round;',
  options: {
    drawPoints: false,
  },
};
groups.add(groupData);

var options = {
  start: vis.moment(), // changed so its faster
  end: vis.moment().add(10, 'seconds'),
  dataAxis: {
    left: {
      range: {
        min:0, max: 300
      }
    }
  },
  autoResize: true,
  width: 'var(--graph-width)',
  height: 'var(--graph-height)',
  shaded: {
    enabled: true,
    style: "fill: black; fill-opacity: 0.2;"
  },
  moveable: true,
  showMinorLabels: false,
  showMajorLabels: false
};
var graph2d = new vis.Graph2d(container, dataset, groups, options);

// a function to generate data points
function y(x) {
  return wpm;
}

function renderStep() {
  addDataPoint();

  // move the window (you can think of different strategies).
  var now = vis.moment();
  var range = graph2d.getWindow();
  var interval = range.end - range.start;

  if (now < range.start)
    graph2d.setWindow(now, now+interval, {animation: false});
  if (now > range.end)
    graph2d.setWindow(now-interval, now, {animation: false});
  //setTimeout(renderStep, DELAY);

}
//renderStep();

/**
 * Add a new datapoint to the graph
 */
function addDataPoint() {
  // add a new data point to the dataset
  var now = vis.moment();
  dataset.add({
    x: now,
    y: y(now / 1000),
    group: 0
  });

  // remove all data points which are no longer visible
  var range = graph2d.getWindow();
  var interval = range.end - range.start;
  var oldIds = dataset.getIds({
    filter: function (item) {
      return item.x < range.start - interval;
    }
  });
  dataset.remove(oldIds);

  //setTimeout(addDataPoint, DELAY);
}

graph2d.moveTo(vis.moment())
