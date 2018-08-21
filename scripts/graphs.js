var DELAY = 250; // delay in ms to add new data points

var containerWpm = document.getElementById('visualization');
var containerVol = document.getElementById('visualization2');
var datasetWpm = new vis.DataSet();
var datasetVol = new vis.DataSet();
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
  start: vis.moment(),
  end: vis.moment().add(60, 'seconds'),
  dataAxis: {
    left: {
      range: {
        min:0, max: 100
      }
    },
    visible: false
  },
  interpolation: false,
  autoResize: true,
  width: 'var(--graph-width)',
  height: 'var(--graph-height)',
  // shaded: {
  //   enabled: true,
  //   style: "fill: black; fill-opacity: 0.2;"
  // },
  moveable: false,
  showMinorLabels: false,
  showMajorLabels: false,
};
var wpmGraph = new vis.Graph2d(containerWpm, datasetWpm, groups, options);
var volGraph = new vis.Graph2d(containerVol, datasetVol, groups, options);

function startGraphing() {
  datasetWpm.clear();
  datasetVol.clear();
  
  renderStep();
}

function yWpm() {
  return wpm/3;
}
function yVol() {
  return volumeMetric;
}

function renderStep() {
  addDataPointVol();
  addDataPointWpm();

  var now = vis.moment();
  var range = wpmGraph.getWindow();
  var interval = range.end - range.start;

  if (now < range.start)
    wpmGraph.setWindow(now, now+interval, {animation: false});
  if (now > range.end)
    wpmGraph.setWindow(now-interval, now, {animation: false});

  range = volGraph.getWindow();
  interval = range.end - range.start;

  if (now < range.start)
    volGraph.setWindow(now, now+interval, {animation: false});
  if (now > range.end)
    volGraph.setWindow(now-interval, now, {animation: false});

  if(dictationActive) setTimeout(renderStep, DELAY);
}


function addDataPointWpm() {
  var now = vis.moment();
  datasetWpm.add({
    x: now,
    y: yWpm(),
    group: 0
  });

  // remove all data points which are no longer visible
  var range = wpmGraph.getWindow();
  var interval = range.end - range.start;
  var oldIds = datasetWpm.getIds({
    filter: function (item) {
      return item.x < range.start - interval;
    }
  });
  datasetWpm.remove(oldIds);
}

function addDataPointVol() {
  var now = vis.moment();
  var thisY = yVol();
  datasetVol.add({
    x: now,
    y: thisY,
    group: 0
  });

  // remove all data points which are no longer visible
  var range = volGraph.getWindow();
  var interval = range.end - range.start;
  var oldIds = datasetVol.getIds({
    filter: function (item) {
      return item.x < range.start - interval;
    }
  });
  datasetVol.remove(oldIds);
  updateTicker('vol', thisY, thisY);
}

wpmGraph.moveTo(vis.moment());
volGraph.moveTo(vis.moment());
