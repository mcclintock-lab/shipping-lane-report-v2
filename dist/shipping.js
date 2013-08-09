;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
module.exports = function(el) {
  var $el, $toggler, app, e, node, nodeid, toc, toggler, togglers, view, _i, _len, _ref;
  $el = $(el);
  app = window.app;
  toc = app.getToc();
  if (!toc) {
    console.log('No table of contents found');
    return;
  }
  togglers = $el.find('a[data-toggle-node]');
  _ref = togglers.toArray();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    toggler = _ref[_i];
    $toggler = $(toggler);
    nodeid = $toggler.data('toggle-node');
    try {
      view = toc.getChildViewById(nodeid);
      node = view.model;
      $toggler.attr('data-visible', !!node.get('visible'));
      $toggler.data('tocItem', view);
    } catch (_error) {
      e = _error;
      $toggler.attr('data-not-found', 'true');
    }
  }
  return togglers.on('click', function(e) {
    e.preventDefault();
    $el = $(e.target);
    view = $el.data('tocItem');
    if (view) {
      view.toggleVisibility(e);
      return $el.attr('data-visible', !!view.model.get('visible'));
    } else {
      return alert("Layer not found in the current Table of Contents. \nExpected nodeid " + ($el.data('toggle-node')));
    }
  });
};


},{}],2:[function(require,module,exports){
var ReportTab, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ReportTab = (function(_super) {
  __extends(ReportTab, _super);

  function ReportTab() {
    this.remove = __bind(this.remove, this);
    _ref = ReportTab.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ReportTab.prototype.name = 'Information';

  ReportTab.prototype.dependencies = [];

  ReportTab.prototype.initialize = function(model, options) {
    this.model = model;
    this.options = options;
    this.app = window.app;
    return _.extend(this, this.options);
  };

  ReportTab.prototype.render = function() {
    throw 'render method must be overidden';
  };

  ReportTab.prototype.show = function() {
    this.$el.show();
    return this.visible = true;
  };

  ReportTab.prototype.hide = function() {
    this.$el.hide();
    return this.visible = false;
  };

  ReportTab.prototype.remove = function() {
    return ReportTab.__super__.remove.call(this);
  };

  ReportTab.prototype.onLoading = function() {};

  ReportTab.prototype.getResult = function(id) {
    var result, results;
    results = this.getResults();
    result = _.find(results, function(r) {
      return r.paramName === id;
    });
    if (result == null) {
      throw new Error('No result with id ' + id);
    }
    return result.value;
  };

  ReportTab.prototype.getFirstResult = function(param, id) {
    var e, result;
    result = this.getResult(param);
    try {
      return result[0].features[0].attributes[id];
    } catch (_error) {
      e = _error;
      throw "Error finding " + param + ":" + id + " in gp results";
    }
  };

  ReportTab.prototype.getResults = function() {
    var results, _ref1, _ref2;
    if (!(results = (_ref1 = this.results) != null ? (_ref2 = _ref1.get('data')) != null ? _ref2.results : void 0 : void 0)) {
      throw new Error('No gp results');
    }
    return _.filter(results, function(result) {
      var _ref3;
      return (_ref3 = result.paramName) !== 'ResultCode' && _ref3 !== 'ResultMsg';
    });
  };

  return ReportTab;

})(Backbone.View);

module.exports = ReportTab;


},{}],3:[function(require,module,exports){
var ShippingLaneTab;

ShippingLaneTab = require('./shippingLaneTab.coffee');

window.app.registerReport(function(report) {
  report.tabs([ShippingLaneTab]);
  return report.stylesheets(['./main.css']);
});


},{"./shippingLaneTab.coffee":4}],4:[function(require,module,exports){
var ReportTab, ShippingLaneReportTab, addCommas, enableLayerTogglers, sightingsTemplate, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

sightingsTemplate = require('./sightingsTemplate.coffee');

ReportTab = require('../../lib/scripts/reportTab.coffee');

enableLayerTogglers = require('../../lib/scripts/enableLayerTogglers.coffee');

addCommas = function(nStr) {
  var rgx, x, x1, x2;
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

ShippingLaneReportTab = (function(_super) {
  __extends(ShippingLaneReportTab, _super);

  function ShippingLaneReportTab() {
    this.onMoreResultsClick = __bind(this.onMoreResultsClick, this);
    _ref = ShippingLaneReportTab.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ShippingLaneReportTab.prototype.name = 'Shipping Lane Report';

  ShippingLaneReportTab.prototype.className = 'shippingLaneInfo';

  ShippingLaneReportTab.prototype.template = require('../templates/templates.js').shippingLaneReport;

  ShippingLaneReportTab.prototype.events = {
    "click a[rel=toggle-layer]": '_handleReportLayerClick',
    "click a.moreResults": 'onMoreResultsClick'
  };

  ShippingLaneReportTab.prototype.dependencies = ['LaneOverlay'];

  ShippingLaneReportTab.prototype.render = function() {
    var area, context, costChange, costIncreasePerNM, costIncreasePerNMPerTransit, existingIsobathIntersection, existingLength, feature, fuelCost, intersectedIsobathM, isobath, isobathChange, isobathChangeClass, isobathPercentChange, length, lengthChangeClass, lengthIncreased, oc, overlapsRig, percentChange, record, rig, rigIntersections, rigs, sightings, sightingsData, species, tonsFuel, tonsFuelPerNM, vc, whaleSightings, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref1, _ref2, _ref3;
    window.results = this.results;
    isobath = this.getResult('Habitats')[0];
    rigs = this.getResult('RigsNear')[0];
    whaleSightings = this.getResult('WhaleCount')[0];
    sightings = {};
    _ref1 = whaleSightings.features;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      feature = _ref1[_i];
      species = feature.attributes.Species;
      if (__indexOf.call(_.keys(sightings), species) < 0) {
        sightings[feature.attributes.Species] = 0;
      }
      sightings[species] = sightings[species] + feature.attributes.FREQUENCY;
    }
    sightingsData = _.map(sightingsTemplate, function(s) {
      return _.clone(s);
    });
    for (_j = 0, _len1 = sightingsData.length; _j < _len1; _j++) {
      record = sightingsData[_j];
      if (sightings[record.id]) {
        record.count = sightings[record.id];
      }
      record.diff = record.count - record.unchangedCount;
      record.percentChange = Math.round((Math.abs(record.diff) / record.unchangedCount) * 100);
      if (record.percentChange === Infinity) {
        record.percentChange = '>100';
      }
      record.changeClass = record.diff > 0 ? 'positive' : 'negative';
      if (_.isNaN(record.percentChange)) {
        record.percentChange = 0;
        record.changeClass = 'nochange';
      }
    }
    area = 0;
    _ref2 = isobath.features;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      feature = _ref2[_k];
      area = area + feature.attributes.Shape_Area;
    }
    rigIntersections = 0;
    _ref3 = rigs.features;
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      rig = _ref3[_l];
      if (rig.attributes.NEAR_DIST < 500) {
        rigIntersections = rigIntersections + 1;
      }
    }
    overlapsRig = rigIntersections > 0;
    intersectedIsobathM = area / 1000;
    existingIsobathIntersection = 54982;
    isobathChange = intersectedIsobathM - existingIsobathIntersection;
    isobathChangeClass = isobathChange > 0 ? 'positive' : 'negative';
    isobathPercentChange = Math.round((Math.abs(isobathChange) / existingIsobathIntersection) * 100);
    existingLength = 122.75;
    length = this.app.projecthomepage.getLayer(this.model).getGraphics(this.model)[0].sketch.get('geometry').features[0].attributes.Shape_Length / 5048;
    window.graphics = this.app.projecthomepage.getLayer(this.model).getGraphics(this.model);
    percentChange = Math.abs(((existingLength - length) / existingLength) * 100);
    lengthIncreased = existingLength - length < 0;
    lengthChangeClass = lengthIncreased ? 'positive' : 'negative';
    if (Math.abs(existingLength - length) < 0.01) {
      lengthChangeClass = 'nochange';
    }
    vc = 3535;
    oc = 2315;
    costIncreasePerNMPerTransit = (vc + oc) / 13.8;
    fuelCost = 625;
    tonsFuelPerNM = (vc / 13.8) / 625;
    costIncreasePerNM = costIncreasePerNMPerTransit * 5725;
    costChange = Math.abs(costIncreasePerNM * (length - existingLength));
    tonsFuel = tonsFuelPerNM * length;
    context = {
      significantDistanceChange: Math.abs(existingLength - length) > 0.1,
      sketchClass: this.app.sketchClasses.get(this.model.get('sketchclass')).forTemplate(),
      sketch: this.model.forTemplate(),
      length: Math.round(length * 100) / 100,
      lengthChangeClass: lengthChangeClass,
      lengthPercentChange: Math.round(percentChange * 10) / 10,
      costChange: addCommas(Math.round(costChange * 100) / 100),
      tonsFuelPerTransit: Math.round(tonsFuel),
      tonsFuelChange: Math.round((tonsFuel - (tonsFuelPerNM * existingLength)) * 5725),
      lengthChange: Math.round((length - existingLength) * 100) / 100,
      intersectsRig: overlapsRig,
      whaleSightings: sightingsData,
      intersectedIsobathM: addCommas(Math.round(intersectedIsobathM)),
      isobathPercentChange: isobathPercentChange,
      isobathChangeClass: isobathChangeClass
    };
    this.$el.html(this.template.render(context, this.partials));
    return enableLayerTogglers(this.$el);
  };

  ShippingLaneReportTab.prototype._handleReportLayerClick = function(e) {
    var node, url;
    e.preventDefault();
    url = $(e.target).attr('href');
    node = window.app.projecthomepage.dataSidebar.layerTree.getNodeByUrl(url);
    if (node != null) {
      node.makeVisible();
    }
    if (node != null) {
      node.makeAllVisibleBelow();
    }
    if (node != null) {
      node.updateMap();
    }
    return false;
  };

  ShippingLaneReportTab.prototype.onMoreResultsClick = function(e) {
    if (e != null) {
      if (typeof e.preventDefault === "function") {
        e.preventDefault();
      }
    }
    return $(e.target).closest('.reportSection').removeClass('collapsed');
  };

  return ShippingLaneReportTab;

})(ReportTab);

module.exports = ShippingLaneReportTab;


},{"../../lib/scripts/enableLayerTogglers.coffee":1,"../../lib/scripts/reportTab.coffee":2,"../templates/templates.js":6,"./sightingsTemplate.coffee":5}],5:[function(require,module,exports){
module.exports = [
  {
    id: 'Blue',
    name: 'Blue Whale',
    scientificName: 'Balaenoptera musculus',
    unchangedCount: 150,
    count: 0
  }, {
    id: 'Humpback',
    name: 'Humpback Whale',
    scientificName: 'Megaptera novaeangliae',
    unchangedCount: 218,
    count: 0
  }, {
    id: 'Gray',
    name: 'Gray Whale',
    scientificName: 'Eschrichtius robustus',
    unchangedCount: 45,
    count: 0
  }, {
    id: 'Fin',
    name: 'Fin Whale',
    scientificName: 'Balaenoptera physalus',
    unchangedCount: 6,
    count: 0
  }, {
    id: 'Minke',
    name: 'Minke Whale',
    scientificName: 'Balaenoptera acutorostrata',
    unchangedCount: 16,
    count: 0
  }, {
    id: 'Pilot Whale',
    name: 'Pilot Whale',
    scientificName: 'Globicephala macrorhynchus',
    unchangedCount: 0,
    count: 0
  }
];


},{}],6:[function(require,module,exports){
this["Templates"] = this["Templates"] || {};

this["Templates"]["shippingLaneReport"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");if(_.s(_.f("intersectsRig",c,p,1),c,p,0,18,294,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<div class=\"reportSection oilRig warning ");_.b(_.v(_.f("lengthChangeClass",c,p,0)));_.b("\">");_.b("\n" + i);_.b("  <h4>Oil Platform Intersection</h4>");_.b("\n" + i);_.b("  <p>");_.b("\n" + i);_.b("    Your proposal overlaps the safety area around an oil platform!");_.b("\n" + i);_.b("    <br>");_.b("\n" + i);_.b("  </p>");_.b("\n" + i);_.b("  <a href=\"#\" data-toggle-node=\"51f2b455c96003dc13013e84\">show platforms</a>");_.b("\n" + i);_.b("</div>");_.b("\n");});c.pop();}_.b("\n" + i);_.b("<div class=\"reportSection sightings ");_.b(_.v(_.f("lengthChangeClass",c,p,0)));_.b(" collapsed\">");_.b("\n" + i);_.b("  <h4>Whale Sightings</h4>");_.b("\n" + i);_.b("  <p>Number of whale sightings within this footprint compared to existing shipping lanes. Sightings are recorded by whalewatching vessels.</p>");_.b("\n" + i);_.b("  <ul class=\"sightings\">");_.b("\n" + i);if(_.s(_.f("whaleSightings",c,p,1),c,p,0,600,779,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <li class=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\">");_.b(_.v(_.f("name",c,p,0)));_.b(" <span class=\"sci\">");_.b(_.v(_.f("scientificName",c,p,0)));_.b("</span><span class=\"diff ");_.b(_.v(_.f("changeClass",c,p,0)));_.b("\">");_.b(_.v(_.f("percentChange",c,p,0)));_.b("</span><span class=\"count\">");_.b(_.v(_.f("count",c,p,0)));_.b("</span></li>");_.b("\n");});c.pop();}_.b("  </ul>");_.b("\n" + i);_.b("  <a class=\"moreResults\" href=\"#\">more results</a>");_.b("\n" + i);_.b("  <a href=\"#\" style=\"float:right;\" data-toggle-node=\"51f2b455c96003dc13013e45\">show sightings layer</a>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("<div class=\"costs reportSection ");_.b(_.v(_.f("lengthChangeClass",c,p,0)));_.b("\">");_.b("\n" + i);_.b("  <h4>Distance and Fuel Costs</h4>");_.b("\n" + i);if(_.s(_.f("significantDistanceChange",c,p,1),c,p,0,1093,1511,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("  <p class=\"summary\"><span class=\"measure\">");_.b(_.v(_.f("lengthPercentChange",c,p,0)));_.b("</span> each year for all transits</p>");_.b("\n" + i);_.b("  <div class=\"distance\">");_.b("\n" + i);_.b("    <span class=\"measure\">");_.b(_.v(_.f("lengthChange",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("    change in length");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("  <div class=\"fuel\">");_.b("\n" + i);_.b("    <span class=\"measure\">");_.b(_.v(_.f("tonsFuelChange",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("    in fuel consumption");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("  <div class=\"cost\">");_.b("\n" + i);_.b("    <span class=\"measure\">$");_.b(_.v(_.f("costChange",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("    in voyage costs");_.b("\n" + i);_.b("  </div>");_.b("\n");});c.pop();}if(!_.s(_.f("significantDistanceChange",c,p,1),c,p,1,0,0,"")){_.b("  <p class=\"summary\">No significant difference from existing configuration.</p>");_.b("\n");};_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("<div class=\"reportSection habitat ");_.b(_.v(_.f("lengthChangeClass",c,p,0)));_.b("\">");_.b("\n" + i);_.b("  <h4>Sensitive Blue Whale Habitat</h4>");_.b("\n" + i);_.b("  <p>");_.b("\n" + i);_.b("    <span class=\"measure\">");_.b(_.v(_.f("intersectedIsobathM",c,p,0)));_.b(" square meters of sensitive habitat disturbed.</span><span class=\"change ");_.b(_.v(_.f("isobathChangeClass",c,p,0)));_.b("\">");_.b(_.v(_.f("isobathPercentChange",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("  </p>");_.b("\n" + i);_.b("</div>");_.b("\n");return _.fl();;});

module.exports = this["Templates"];
},{}]},{},[3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY2J1cnQvV29ya2luZy9zaGlwcGluZy1sYW5lLXJlcG9ydC9saWIvc2NyaXB0cy9lbmFibGVMYXllclRvZ2dsZXJzLmNvZmZlZSIsIi9Vc2Vycy9jYnVydC9Xb3JraW5nL3NoaXBwaW5nLWxhbmUtcmVwb3J0L2xpYi9zY3JpcHRzL3JlcG9ydFRhYi5jb2ZmZWUiLCIvVXNlcnMvY2J1cnQvV29ya2luZy9zaGlwcGluZy1sYW5lLXJlcG9ydC9zcmMvc2NyaXB0cy9zaGlwcGluZy5jb2ZmZWUiLCIvVXNlcnMvY2J1cnQvV29ya2luZy9zaGlwcGluZy1sYW5lLXJlcG9ydC9zcmMvc2NyaXB0cy9zaGlwcGluZ0xhbmVUYWIuY29mZmVlIiwiL1VzZXJzL2NidXJ0L1dvcmtpbmcvc2hpcHBpbmctbGFuZS1yZXBvcnQvc3JjL3NjcmlwdHMvc2lnaHRpbmdzVGVtcGxhdGUuY29mZmVlIiwiL1VzZXJzL2NidXJ0L1dvcmtpbmcvc2hpcHBpbmctbGFuZS1yZXBvcnQvc3JjL3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLENBQU8sQ0FBVSxDQUFBLEdBQVgsQ0FBTixFQUFrQjtDQUNoQixLQUFBLDJFQUFBO0NBQUEsQ0FBQSxDQUFBO0NBQUEsQ0FDQSxDQUFBLEdBQVk7Q0FEWixDQUVBLENBQUEsR0FBTTtBQUNDLENBQVAsQ0FBQSxDQUFBLENBQUE7Q0FDRSxFQUFBLENBQUEsR0FBTyxxQkFBUDtDQUNBLFNBQUE7SUFMRjtDQUFBLENBTUEsQ0FBVyxDQUFBLElBQVgsYUFBVztDQUVYO0NBQUEsTUFBQSxvQ0FBQTt3QkFBQTtDQUNFLEVBQVcsQ0FBWCxHQUFXLENBQVg7Q0FBQSxFQUNTLENBQVQsRUFBQSxFQUFpQixLQUFSO0NBQ1Q7Q0FDRSxFQUFPLENBQVAsRUFBQSxVQUFPO0NBQVAsRUFDTyxDQUFQLENBREEsQ0FDQTtBQUMrQixDQUYvQixDQUU4QixDQUFFLENBQWhD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RjtDQUFBLENBSWtCLEVBQWhCLFVBQUE7Q0FKRixDQUtTLEVBQVAsQ0FBQTtFQUVGLEVBN0JlO0NBNkJmLENBQ0UsRUFBQSxHQURGO0NBQUEsQ0FFUSxFQUFOLFNBRkY7Q0FBQSxDQUdrQixFQUFoQixVQUFBLGNBSEY7Q0FBQSxDQUlrQixFQUFoQixVQUFBO0NBSkYsQ0FLUyxFQUFQLENBQUE7RUFFRixFQXBDZTtDQW9DZixDQUNFLEVBQUEsU0FERjtDQUFBLENBRVEsRUFBTixTQUZGO0NBQUEsQ0FHa0IsRUFBaEIsVUFBQSxjQUhGO0NBQUEsQ0FJa0IsRUFBaEIsVUFBQTtDQUpGLENBS1MsRUFBUCxDQUFBO0lBekNhO0NBQWpCLENBQUE7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSAoZWwpIC0+XG4gICRlbCA9ICQgZWxcbiAgYXBwID0gd2luZG93LmFwcFxuICB0b2MgPSBhcHAuZ2V0VG9jKClcbiAgdW5sZXNzIHRvY1xuICAgIGNvbnNvbGUubG9nICdObyB0YWJsZSBvZiBjb250ZW50cyBmb3VuZCdcbiAgICByZXR1cm5cbiAgdG9nZ2xlcnMgPSAkZWwuZmluZCgnYVtkYXRhLXRvZ2dsZS1ub2RlXScpXG4gICMgU2V0IGluaXRpYWwgc3RhdGVcbiAgZm9yIHRvZ2dsZXIgaW4gdG9nZ2xlcnMudG9BcnJheSgpXG4gICAgJHRvZ2dsZXIgPSAkKHRvZ2dsZXIpXG4gICAgbm9kZWlkID0gJHRvZ2dsZXIuZGF0YSgndG9nZ2xlLW5vZGUnKVxuICAgIHRyeVxuICAgICAgdmlldyA9IHRvYy5nZXRDaGlsZFZpZXdCeUlkIG5vZGVpZFxuICAgICAgbm9kZSA9IHZpZXcubW9kZWxcbiAgICAgICR0b2dnbGVyLmF0dHIgJ2RhdGEtdmlzaWJsZScsICEhbm9kZS5nZXQoJ3Zpc2libGUnKVxuICAgICAgJHRvZ2dsZXIuZGF0YSAndG9jSXRlbScsIHZpZXdcbiAgICBjYXRjaCBlXG4gICAgICAkdG9nZ2xlci5hdHRyICdkYXRhLW5vdC1mb3VuZCcsICd0cnVlJ1xuXG4gIHRvZ2dsZXJzLm9uICdjbGljaycsIChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICRlbCA9ICQoZS50YXJnZXQpXG4gICAgdmlldyA9ICRlbC5kYXRhKCd0b2NJdGVtJylcbiAgICBpZiB2aWV3XG4gICAgICB2aWV3LnRvZ2dsZVZpc2liaWxpdHkoZSlcbiAgICAgICRlbC5hdHRyICdkYXRhLXZpc2libGUnLCAhIXZpZXcubW9kZWwuZ2V0KCd2aXNpYmxlJylcbiAgICBlbHNlXG4gICAgICBhbGVydCBcIkxheWVyIG5vdCBmb3VuZCBpbiB0aGUgY3VycmVudCBUYWJsZSBvZiBDb250ZW50cy4gXFxuRXhwZWN0ZWQgbm9kZWlkICN7JGVsLmRhdGEoJ3RvZ2dsZS1ub2RlJyl9XCJcbiIsImNsYXNzIFJlcG9ydFRhYiBleHRlbmRzIEJhY2tib25lLlZpZXdcbiAgbmFtZTogJ0luZm9ybWF0aW9uJ1xuICBkZXBlbmRlbmNpZXM6IFtdXG5cbiAgaW5pdGlhbGl6ZTogKEBtb2RlbCwgQG9wdGlvbnMpIC0+XG4gICAgIyBXaWxsIGJlIGluaXRpYWxpemVkIGJ5IFNlYVNrZXRjaCB3aXRoIHRoZSBmb2xsb3dpbmcgYXJndW1lbnRzOlxuICAgICMgICAqIG1vZGVsIC0gVGhlIHNrZXRjaCBiZWluZyByZXBvcnRlZCBvblxuICAgICMgICAqIG9wdGlvbnNcbiAgICAjICAgICAtIC5wYXJlbnQgLSB0aGUgcGFyZW50IHJlcG9ydCB2aWV3IFxuICAgICMgICAgICAgIGNhbGwgQG9wdGlvbnMucGFyZW50LmRlc3Ryb3koKSB0byBjbG9zZSB0aGUgd2hvbGUgcmVwb3J0IHdpbmRvd1xuICAgIEBhcHAgPSB3aW5kb3cuYXBwXG4gICAgXy5leHRlbmQgQCwgQG9wdGlvbnNcblxuICByZW5kZXI6ICgpIC0+XG4gICAgdGhyb3cgJ3JlbmRlciBtZXRob2QgbXVzdCBiZSBvdmVyaWRkZW4nXG5cbiAgc2hvdzogKCkgLT5cbiAgICBAJGVsLnNob3coKVxuICAgIEB2aXNpYmxlID0gdHJ1ZVxuXG4gIGhpZGU6ICgpIC0+XG4gICAgQCRlbC5oaWRlKClcbiAgICBAdmlzaWJsZSA9IGZhbHNlXG5cbiAgcmVtb3ZlOiAoKSA9PlxuICAgIHN1cGVyKClcbiAgXG4gIG9uTG9hZGluZzogKCkgLT4gIyBleHRlbnNpb24gcG9pbnQgZm9yIHN1YmNsYXNzZXNcblxuICBnZXRSZXN1bHQ6IChpZCkgLT5cbiAgICByZXN1bHRzID0gQGdldFJlc3VsdHMoKVxuICAgIHJlc3VsdCA9IF8uZmluZCByZXN1bHRzLCAocikgLT4gci5wYXJhbU5hbWUgaXMgaWRcbiAgICB1bmxlc3MgcmVzdWx0P1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyByZXN1bHQgd2l0aCBpZCAnICsgaWQpXG4gICAgcmVzdWx0LnZhbHVlXG5cbiAgZ2V0Rmlyc3RSZXN1bHQ6IChwYXJhbSwgaWQpIC0+XG4gICAgcmVzdWx0ID0gQGdldFJlc3VsdChwYXJhbSlcbiAgICB0cnlcbiAgICAgIHJldHVybiByZXN1bHRbMF0uZmVhdHVyZXNbMF0uYXR0cmlidXRlc1tpZF1cbiAgICBjYXRjaCBlXG4gICAgICB0aHJvdyBcIkVycm9yIGZpbmRpbmcgI3twYXJhbX06I3tpZH0gaW4gZ3AgcmVzdWx0c1wiXG5cbiAgZ2V0UmVzdWx0czogKCkgLT5cbiAgICB1bmxlc3MgcmVzdWx0cyA9IEByZXN1bHRzPy5nZXQoJ2RhdGEnKT8ucmVzdWx0c1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBncCByZXN1bHRzJylcbiAgICBfLmZpbHRlciByZXN1bHRzLCAocmVzdWx0KSAtPlxuICAgICAgcmVzdWx0LnBhcmFtTmFtZSBub3QgaW4gWydSZXN1bHRDb2RlJywgJ1Jlc3VsdE1zZyddXG5cbm1vZHVsZS5leHBvcnRzID0gUmVwb3J0VGFiIiwiU2hpcHBpbmdMYW5lVGFiID0gcmVxdWlyZSAnLi9zaGlwcGluZ0xhbmVUYWIuY29mZmVlJ1xuXG53aW5kb3cuYXBwLnJlZ2lzdGVyUmVwb3J0IChyZXBvcnQpIC0+XG4gIHJlcG9ydC50YWJzIFtTaGlwcGluZ0xhbmVUYWJdXG4gICMgcGF0aCBtdXN0IGJlIHJlbGF0aXZlIHRvIGRpc3QvXG4gIHJlcG9ydC5zdHlsZXNoZWV0cyBbJy4vbWFpbi5jc3MnXVxuIiwic2lnaHRpbmdzVGVtcGxhdGUgPSByZXF1aXJlICcuL3NpZ2h0aW5nc1RlbXBsYXRlLmNvZmZlZSdcblJlcG9ydFRhYiA9IHJlcXVpcmUgJy4uLy4uL2xpYi9zY3JpcHRzL3JlcG9ydFRhYi5jb2ZmZWUnXG5lbmFibGVMYXllclRvZ2dsZXJzID0gcmVxdWlyZSAnLi4vLi4vbGliL3NjcmlwdHMvZW5hYmxlTGF5ZXJUb2dnbGVycy5jb2ZmZWUnXG5cbmFkZENvbW1hcyA9IChuU3RyKSAtPlxuICBuU3RyICs9ICcnXG4gIHggPSBuU3RyLnNwbGl0KCcuJylcbiAgeDEgPSB4WzBdXG4gIHgyID0gaWYgeC5sZW5ndGggPiAxIHRoZW4gJy4nICsgeFsxXSBlbHNlICcnXG4gIHJneCA9IC8oXFxkKykoXFxkezN9KS9cbiAgd2hpbGUgKHJneC50ZXN0KHgxKSlcbiAgICB4MSA9IHgxLnJlcGxhY2Uocmd4LCAnJDEnICsgJywnICsgJyQyJylcbiAgcmV0dXJuIHgxICsgeDJcblxuY2xhc3MgU2hpcHBpbmdMYW5lUmVwb3J0VGFiIGV4dGVuZHMgUmVwb3J0VGFiXG4gIG5hbWU6ICdTaGlwcGluZyBMYW5lIFJlcG9ydCdcbiAgY2xhc3NOYW1lOiAnc2hpcHBpbmdMYW5lSW5mbydcbiAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMnKS5zaGlwcGluZ0xhbmVSZXBvcnRcbiAgZXZlbnRzOlxuICAgIFwiY2xpY2sgYVtyZWw9dG9nZ2xlLWxheWVyXVwiIDogJ19oYW5kbGVSZXBvcnRMYXllckNsaWNrJ1xuICAgIFwiY2xpY2sgYS5tb3JlUmVzdWx0c1wiOiAgICAgICAgJ29uTW9yZVJlc3VsdHNDbGljaydcbiAgZGVwZW5kZW5jaWVzOiBbJ0xhbmVPdmVybGF5J11cblxuICByZW5kZXI6ICgpIC0+XG4gICAgd2luZG93LnJlc3VsdHMgPSBAcmVzdWx0c1xuICAgIGlzb2JhdGggPSBAZ2V0UmVzdWx0KCdIYWJpdGF0cycpWzBdXG4gICAgIyBpc29iYXRoID0gQHJlc3VsdHMucmVzdWx0c1syXVxuICAgIHJpZ3MgPSBAZ2V0UmVzdWx0KCdSaWdzTmVhcicpWzBdXG4gICAgd2hhbGVTaWdodGluZ3MgPSBAZ2V0UmVzdWx0KCdXaGFsZUNvdW50JylbMF1cbiAgICBzaWdodGluZ3MgPSB7fVxuICAgIGZvciBmZWF0dXJlIGluIHdoYWxlU2lnaHRpbmdzLmZlYXR1cmVzXG4gICAgICBzcGVjaWVzID0gZmVhdHVyZS5hdHRyaWJ1dGVzLlNwZWNpZXNcbiAgICAgIHVubGVzcyBzcGVjaWVzIGluIF8ua2V5cyhzaWdodGluZ3MpXG4gICAgICAgIHNpZ2h0aW5nc1tmZWF0dXJlLmF0dHJpYnV0ZXMuU3BlY2llc10gPSAwXG4gICAgICBzaWdodGluZ3Nbc3BlY2llc10gPSBzaWdodGluZ3Nbc3BlY2llc10gKyBmZWF0dXJlLmF0dHJpYnV0ZXMuRlJFUVVFTkNZXG4gICAgc2lnaHRpbmdzRGF0YSA9IF8ubWFwIHNpZ2h0aW5nc1RlbXBsYXRlLCAocykgLT4gXy5jbG9uZShzKVxuICAgIGZvciByZWNvcmQgaW4gc2lnaHRpbmdzRGF0YVxuICAgICAgcmVjb3JkLmNvdW50ID0gc2lnaHRpbmdzW3JlY29yZC5pZF0gaWYgc2lnaHRpbmdzW3JlY29yZC5pZF1cbiAgICAgIHJlY29yZC5kaWZmID0gcmVjb3JkLmNvdW50IC0gcmVjb3JkLnVuY2hhbmdlZENvdW50XG4gICAgICByZWNvcmQucGVyY2VudENoYW5nZSA9ICBNYXRoLnJvdW5kKChNYXRoLmFicyhyZWNvcmQuZGlmZikvcmVjb3JkLnVuY2hhbmdlZENvdW50KSAqIDEwMClcbiAgICAgIGlmIHJlY29yZC5wZXJjZW50Q2hhbmdlIGlzIEluZmluaXR5IHRoZW4gcmVjb3JkLnBlcmNlbnRDaGFuZ2UgPSAnPjEwMCc7XG4gICAgICByZWNvcmQuY2hhbmdlQ2xhc3MgPSBpZiByZWNvcmQuZGlmZiA+IDAgdGhlbiAncG9zaXRpdmUnIGVsc2UgJ25lZ2F0aXZlJ1xuICAgICAgaWYgXy5pc05hTihyZWNvcmQucGVyY2VudENoYW5nZSlcbiAgICAgICAgcmVjb3JkLnBlcmNlbnRDaGFuZ2UgPSAwXG4gICAgICAgIHJlY29yZC5jaGFuZ2VDbGFzcyA9ICdub2NoYW5nZSdcbiAgICBhcmVhID0gMFxuICAgIGZvciBmZWF0dXJlIGluIGlzb2JhdGguZmVhdHVyZXNcbiAgICAgIGFyZWEgPSBhcmVhICsgZmVhdHVyZS5hdHRyaWJ1dGVzLlNoYXBlX0FyZWFcbiAgICByaWdJbnRlcnNlY3Rpb25zID0gMFxuICAgIGZvciByaWcgaW4gcmlncy5mZWF0dXJlc1xuICAgICAgaWYgcmlnLmF0dHJpYnV0ZXMuTkVBUl9ESVNUIDwgNTAwXG4gICAgICAgIHJpZ0ludGVyc2VjdGlvbnMgPSByaWdJbnRlcnNlY3Rpb25zICsgMVxuICAgIG92ZXJsYXBzUmlnID0gcmlnSW50ZXJzZWN0aW9ucyA+IDBcbiAgICBpbnRlcnNlY3RlZElzb2JhdGhNID0gYXJlYSAvIDEwMDBcbiAgICBleGlzdGluZ0lzb2JhdGhJbnRlcnNlY3Rpb24gPSA1NDk4MlxuICAgIGlzb2JhdGhDaGFuZ2UgPSBpbnRlcnNlY3RlZElzb2JhdGhNIC0gZXhpc3RpbmdJc29iYXRoSW50ZXJzZWN0aW9uXG4gICAgaXNvYmF0aENoYW5nZUNsYXNzID0gaWYgaXNvYmF0aENoYW5nZSA+IDAgdGhlbiAncG9zaXRpdmUnIGVsc2UgJ25lZ2F0aXZlJ1xuICAgIGlzb2JhdGhQZXJjZW50Q2hhbmdlID0gTWF0aC5yb3VuZCgoTWF0aC5hYnMoaXNvYmF0aENoYW5nZSkgLyBleGlzdGluZ0lzb2JhdGhJbnRlcnNlY3Rpb24pICogMTAwKVxuICAgIGV4aXN0aW5nTGVuZ3RoID0gMTIyLjc1XG4gICAgbGVuZ3RoID0gQGFwcC5wcm9qZWN0aG9tZXBhZ2UuZ2V0TGF5ZXIoQG1vZGVsKS5nZXRHcmFwaGljcyhAbW9kZWwpWzBdLnNrZXRjaC5nZXQoJ2dlb21ldHJ5JykuZmVhdHVyZXNbMF0uYXR0cmlidXRlcy5TaGFwZV9MZW5ndGggLyA1MDQ4XG4gICAgI2xlbmd0aCA9IEBhcHAucHJvamVjdGhvbWVwYWdlLmdldExheWVyKEBtb2RlbCkuZ2V0R3JhcGhpY3MoQG1vZGVsKVswXS5hdHRyaWJ1dGVzLlNoYXBlX0xlbmd0aCAvIDUwNDhcbiAgICB3aW5kb3cuZ3JhcGhpY3MgPSBAYXBwLnByb2plY3Rob21lcGFnZS5nZXRMYXllcihAbW9kZWwpLmdldEdyYXBoaWNzKEBtb2RlbClcbiAgICBwZXJjZW50Q2hhbmdlID0gTWF0aC5hYnMoKChleGlzdGluZ0xlbmd0aCAtIGxlbmd0aCkgLyBleGlzdGluZ0xlbmd0aCkgKiAxMDApXG4gICAgbGVuZ3RoSW5jcmVhc2VkID0gZXhpc3RpbmdMZW5ndGggLSBsZW5ndGggPCAwXG4gICAgbGVuZ3RoQ2hhbmdlQ2xhc3MgPSBpZiBsZW5ndGhJbmNyZWFzZWQgdGhlbiAncG9zaXRpdmUnIGVsc2UgJ25lZ2F0aXZlJ1xuICAgIGlmIE1hdGguYWJzKGV4aXN0aW5nTGVuZ3RoIC0gbGVuZ3RoKSA8IDAuMDFcbiAgICAgIGxlbmd0aENoYW5nZUNsYXNzID0gJ25vY2hhbmdlJ1xuICAgICMgZnJvbSBodHRwOi8vd3d3LmJyZW4udWNzYi5lZHUvcmVzZWFyY2gvZG9jdW1lbnRzL3doYWxlc19yZXBvcnQucGRmXG4gICAgIyBpbmNyZWFzZSBpbiB2b3lhZ2UgY29zdCBwZXIgbm1cbiAgICB2YyA9IDM1MzVcbiAgICAjIGluY3JlYXNlIGluIG9wZXJhdGluZyBjb3N0c1xuICAgIG9jID0gMjMxNVxuICAgICMgcGFnZSA0MCBsaXN0cyBsYW5lIGluY3JlYXNlIGFzIDEzLjhubVxuICAgIGNvc3RJbmNyZWFzZVBlck5NUGVyVHJhbnNpdCA9ICh2YyArIG9jKSAvIDEzLjhcbiAgICAjIEknbSB3b3JraW5nIGJhY2t3b3JkcyBoZXJlLCBzbyBhbGwgdGhpcyBzaGl0IGlzIHRlcnJpYmx5IGluYWNjdXJhdGVcbiAgICBmdWVsQ29zdCA9IDYyNSAjIHBlciB0b25cbiAgICAjIGFzc3VtZXMgdm95YWdlIGNvc3QgaXMgYWxsIGZ1ZWwgKHdyb25nIC0gaWdub3JpbmcgbHVicmljYW50LCBkb2NrIGZlZXMsIGV0YylcbiAgICB0b25zRnVlbFBlck5NID0gKHZjIC8gMTMuOCkgLyA2MjVcbiAgICAjIDUsNzI1IHRyYW5zaXRzIC0gcGFnZSA4N1xuICAgIGNvc3RJbmNyZWFzZVBlck5NID0gY29zdEluY3JlYXNlUGVyTk1QZXJUcmFuc2l0ICogNTcyNVxuICAgIGNvc3RDaGFuZ2UgPSBNYXRoLmFicyhjb3N0SW5jcmVhc2VQZXJOTSAqIChsZW5ndGggLSBleGlzdGluZ0xlbmd0aCkpXG4gICAgdG9uc0Z1ZWwgPSB0b25zRnVlbFBlck5NICogbGVuZ3RoXG4gICAgY29udGV4dCA9XG4gICAgICBzaWduaWZpY2FudERpc3RhbmNlQ2hhbmdlOiBNYXRoLmFicyhleGlzdGluZ0xlbmd0aCAtIGxlbmd0aCkgPiAwLjFcbiAgICAgIHNrZXRjaENsYXNzOiBAYXBwLnNrZXRjaENsYXNzZXMuZ2V0KEBtb2RlbC5nZXQgJ3NrZXRjaGNsYXNzJykuZm9yVGVtcGxhdGUoKVxuICAgICAgc2tldGNoOiBAbW9kZWwuZm9yVGVtcGxhdGUoKVxuICAgICAgbGVuZ3RoOiBNYXRoLnJvdW5kKGxlbmd0aCAqIDEwMCkgLyAxMDBcbiAgICAgIGxlbmd0aENoYW5nZUNsYXNzOiBsZW5ndGhDaGFuZ2VDbGFzc1xuICAgICAgbGVuZ3RoUGVyY2VudENoYW5nZTogTWF0aC5yb3VuZChwZXJjZW50Q2hhbmdlICogMTApIC8gMTBcbiAgICAgIGNvc3RDaGFuZ2U6IGFkZENvbW1hcyhNYXRoLnJvdW5kKGNvc3RDaGFuZ2UgKiAxMDApIC8gMTAwKVxuICAgICAgdG9uc0Z1ZWxQZXJUcmFuc2l0OiBNYXRoLnJvdW5kKHRvbnNGdWVsKVxuICAgICAgdG9uc0Z1ZWxDaGFuZ2U6IE1hdGgucm91bmQoKHRvbnNGdWVsIC0gKHRvbnNGdWVsUGVyTk0gKiBleGlzdGluZ0xlbmd0aCkpICogNTcyNSlcbiAgICAgIGxlbmd0aENoYW5nZTogTWF0aC5yb3VuZCgobGVuZ3RoIC0gZXhpc3RpbmdMZW5ndGgpICogMTAwKSAvIDEwMFxuICAgICAgaW50ZXJzZWN0c1JpZzogb3ZlcmxhcHNSaWdcbiAgICAgIHdoYWxlU2lnaHRpbmdzOiBzaWdodGluZ3NEYXRhXG4gICAgICBpbnRlcnNlY3RlZElzb2JhdGhNOiBhZGRDb21tYXMoTWF0aC5yb3VuZChpbnRlcnNlY3RlZElzb2JhdGhNKSlcbiAgICAgIGlzb2JhdGhQZXJjZW50Q2hhbmdlOiBpc29iYXRoUGVyY2VudENoYW5nZVxuICAgICAgaXNvYmF0aENoYW5nZUNsYXNzOiBpc29iYXRoQ2hhbmdlQ2xhc3NcblxuICAgIEAkZWwuaHRtbCBAdGVtcGxhdGUucmVuZGVyIGNvbnRleHQsIEBwYXJ0aWFsc1xuXG4gICAgZW5hYmxlTGF5ZXJUb2dnbGVycyhAJGVsKVxuXG4gICAgIyBTaG91bGRuJ3Qgd2UgZ2l2ZSBzb21lIGZlZWRiYWNrIHRvIHRoZSB1c2VyIGlmIHRoZSBsYXllciBpc24ndCBwcmVzZW50IGluIHRoZSBsYXllciB0cmVlP1xuICBfaGFuZGxlUmVwb3J0TGF5ZXJDbGljazogKGUpIC0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdXJsID0gJChlLnRhcmdldCkuYXR0cignaHJlZicpXG4gICAgbm9kZSA9IHdpbmRvdy5hcHAucHJvamVjdGhvbWVwYWdlLmRhdGFTaWRlYmFyLmxheWVyVHJlZS5nZXROb2RlQnlVcmwgdXJsXG4gICAgbm9kZT8ubWFrZVZpc2libGUoKVxuICAgIG5vZGU/Lm1ha2VBbGxWaXNpYmxlQmVsb3coKVxuICAgIG5vZGU/LnVwZGF0ZU1hcCgpXG4gICAgZmFsc2VcblxuICBvbk1vcmVSZXN1bHRzQ2xpY2s6IChlKSA9PlxuICAgIGU/LnByZXZlbnREZWZhdWx0PygpXG4gICAgJChlLnRhcmdldCkuY2xvc2VzdCgnLnJlcG9ydFNlY3Rpb24nKS5yZW1vdmVDbGFzcyAnY29sbGFwc2VkJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXBwaW5nTGFuZVJlcG9ydFRhYiIsIm1vZHVsZS5leHBvcnRzID0gW1xuICB7XG4gICAgaWQ6ICdCbHVlJ1xuICAgIG5hbWU6ICdCbHVlIFdoYWxlJ1xuICAgIHNjaWVudGlmaWNOYW1lOiAnQmFsYWVub3B0ZXJhIG11c2N1bHVzJ1xuICAgIHVuY2hhbmdlZENvdW50OiAxNTBcbiAgICBjb3VudDogMFxuICB9LFxuICB7XG4gICAgaWQ6ICdIdW1wYmFjaydcbiAgICBuYW1lOiAnSHVtcGJhY2sgV2hhbGUnXG4gICAgc2NpZW50aWZpY05hbWU6ICdNZWdhcHRlcmEgbm92YWVhbmdsaWFlJ1xuICAgIHVuY2hhbmdlZENvdW50OiAyMThcbiAgICBjb3VudDogMFxuICB9LFxuICB7XG4gICAgaWQ6ICdHcmF5J1xuICAgIG5hbWU6ICdHcmF5IFdoYWxlJ1xuICAgIHNjaWVudGlmaWNOYW1lOiAnRXNjaHJpY2h0aXVzIHJvYnVzdHVzJ1xuICAgIHVuY2hhbmdlZENvdW50OiA0NVxuICAgIGNvdW50OiAwXG4gIH0sXG4gIHtcbiAgICBpZDogJ0ZpbidcbiAgICBuYW1lOiAnRmluIFdoYWxlJ1xuICAgIHNjaWVudGlmaWNOYW1lOiAnQmFsYWVub3B0ZXJhIHBoeXNhbHVzJ1xuICAgIHVuY2hhbmdlZENvdW50OiA2XG4gICAgY291bnQ6IDBcbiAgfSxcbiAge1xuICAgIGlkOiAnTWlua2UnXG4gICAgbmFtZTogJ01pbmtlIFdoYWxlJ1xuICAgIHNjaWVudGlmaWNOYW1lOiAnQmFsYWVub3B0ZXJhIGFjdXRvcm9zdHJhdGEnXG4gICAgdW5jaGFuZ2VkQ291bnQ6IDE2XG4gICAgY291bnQ6IDBcbiAgfSxcbiAge1xuICAgIGlkOiAnUGlsb3QgV2hhbGUnXG4gICAgbmFtZTogJ1BpbG90IFdoYWxlJ1xuICAgIHNjaWVudGlmaWNOYW1lOiAnR2xvYmljZXBoYWxhIG1hY3Jvcmh5bmNodXMnXG4gICAgdW5jaGFuZ2VkQ291bnQ6IDBcbiAgICBjb3VudDogMFxuICB9XG5dIiwidGhpc1tcIlRlbXBsYXRlc1wiXSA9IHRoaXNbXCJUZW1wbGF0ZXNcIl0gfHwge307XG5cbnRoaXNbXCJUZW1wbGF0ZXNcIl1bXCJzaGlwcGluZ0xhbmVSZXBvcnRcIl0gPSBuZXcgSG9nYW4uVGVtcGxhdGUoZnVuY3Rpb24oYyxwLGkpe3ZhciBfPXRoaXM7Xy5iKGk9aXx8XCJcIik7aWYoXy5zKF8uZihcImludGVyc2VjdHNSaWdcIixjLHAsMSksYyxwLDAsMTgsMjk0LFwie3sgfX1cIikpe18ucnMoYyxwLGZ1bmN0aW9uKGMscCxfKXtfLmIoXCI8ZGl2IGNsYXNzPVxcXCJyZXBvcnRTZWN0aW9uIG9pbFJpZyB3YXJuaW5nIFwiKTtfLmIoXy52KF8uZihcImxlbmd0aENoYW5nZUNsYXNzXCIsYyxwLDApKSk7Xy5iKFwiXFxcIj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDxoND5PaWwgUGxhdGZvcm0gSW50ZXJzZWN0aW9uPC9oND5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDxwPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgICBZb3VyIHByb3Bvc2FsIG92ZXJsYXBzIHRoZSBzYWZldHkgYXJlYSBhcm91bmQgYW4gb2lsIHBsYXRmb3JtIVwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgICA8YnI+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8L3A+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8YSBocmVmPVxcXCIjXFxcIiBkYXRhLXRvZ2dsZS1ub2RlPVxcXCI1MWYyYjQ1NWM5NjAwM2RjMTMwMTNlODRcXFwiPnNob3cgcGxhdGZvcm1zPC9hPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIjwvZGl2PlwiKTtfLmIoXCJcXG5cIik7fSk7Yy5wb3AoKTt9Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCI8ZGl2IGNsYXNzPVxcXCJyZXBvcnRTZWN0aW9uIHNpZ2h0aW5ncyBcIik7Xy5iKF8udihfLmYoXCJsZW5ndGhDaGFuZ2VDbGFzc1wiLGMscCwwKSkpO18uYihcIiBjb2xsYXBzZWRcXFwiPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPGg0PldoYWxlIFNpZ2h0aW5nczwvaDQ+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8cD5OdW1iZXIgb2Ygd2hhbGUgc2lnaHRpbmdzIHdpdGhpbiB0aGlzIGZvb3RwcmludCBjb21wYXJlZCB0byBleGlzdGluZyBzaGlwcGluZyBsYW5lcy4gU2lnaHRpbmdzIGFyZSByZWNvcmRlZCBieSB3aGFsZXdhdGNoaW5nIHZlc3NlbHMuPC9wPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPHVsIGNsYXNzPVxcXCJzaWdodGluZ3NcXFwiPlwiKTtfLmIoXCJcXG5cIiArIGkpO2lmKF8ucyhfLmYoXCJ3aGFsZVNpZ2h0aW5nc1wiLGMscCwxKSxjLHAsMCw2MDAsNzc5LFwie3sgfX1cIikpe18ucnMoYyxwLGZ1bmN0aW9uKGMscCxfKXtfLmIoXCIgICAgPGxpIGNsYXNzPVxcXCJcIik7Xy5iKF8udihfLmYoXCJpZFwiLGMscCwwKSkpO18uYihcIlxcXCI+XCIpO18uYihfLnYoXy5mKFwibmFtZVwiLGMscCwwKSkpO18uYihcIiA8c3BhbiBjbGFzcz1cXFwic2NpXFxcIj5cIik7Xy5iKF8udihfLmYoXCJzY2llbnRpZmljTmFtZVwiLGMscCwwKSkpO18uYihcIjwvc3Bhbj48c3BhbiBjbGFzcz1cXFwiZGlmZiBcIik7Xy5iKF8udihfLmYoXCJjaGFuZ2VDbGFzc1wiLGMscCwwKSkpO18uYihcIlxcXCI+XCIpO18uYihfLnYoXy5mKFwicGVyY2VudENoYW5nZVwiLGMscCwwKSkpO18uYihcIjwvc3Bhbj48c3BhbiBjbGFzcz1cXFwiY291bnRcXFwiPlwiKTtfLmIoXy52KF8uZihcImNvdW50XCIsYyxwLDApKSk7Xy5iKFwiPC9zcGFuPjwvbGk+XCIpO18uYihcIlxcblwiKTt9KTtjLnBvcCgpO31fLmIoXCIgIDwvdWw+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8YSBjbGFzcz1cXFwibW9yZVJlc3VsdHNcXFwiIGhyZWY9XFxcIiNcXFwiPm1vcmUgcmVzdWx0czwvYT5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDxhIGhyZWY9XFxcIiNcXFwiIHN0eWxlPVxcXCJmbG9hdDpyaWdodDtcXFwiIGRhdGEtdG9nZ2xlLW5vZGU9XFxcIjUxZjJiNDU1Yzk2MDAzZGMxMzAxM2U0NVxcXCI+c2hvdyBzaWdodGluZ3MgbGF5ZXI8L2E+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiPC9kaXY+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCI8ZGl2IGNsYXNzPVxcXCJjb3N0cyByZXBvcnRTZWN0aW9uIFwiKTtfLmIoXy52KF8uZihcImxlbmd0aENoYW5nZUNsYXNzXCIsYyxwLDApKSk7Xy5iKFwiXFxcIj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDxoND5EaXN0YW5jZSBhbmQgRnVlbCBDb3N0czwvaDQ+XCIpO18uYihcIlxcblwiICsgaSk7aWYoXy5zKF8uZihcInNpZ25pZmljYW50RGlzdGFuY2VDaGFuZ2VcIixjLHAsMSksYyxwLDAsMTA5MywxNTExLFwie3sgfX1cIikpe18ucnMoYyxwLGZ1bmN0aW9uKGMscCxfKXtfLmIoXCIgIDxwIGNsYXNzPVxcXCJzdW1tYXJ5XFxcIj48c3BhbiBjbGFzcz1cXFwibWVhc3VyZVxcXCI+XCIpO18uYihfLnYoXy5mKFwibGVuZ3RoUGVyY2VudENoYW5nZVwiLGMscCwwKSkpO18uYihcIjwvc3Bhbj4gZWFjaCB5ZWFyIGZvciBhbGwgdHJhbnNpdHM8L3A+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8ZGl2IGNsYXNzPVxcXCJkaXN0YW5jZVxcXCI+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICAgIDxzcGFuIGNsYXNzPVxcXCJtZWFzdXJlXFxcIj5cIik7Xy5iKF8udihfLmYoXCJsZW5ndGhDaGFuZ2VcIixjLHAsMCkpKTtfLmIoXCI8L3NwYW4+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICAgIGNoYW5nZSBpbiBsZW5ndGhcIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDwvZGl2PlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPGRpdiBjbGFzcz1cXFwiZnVlbFxcXCI+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICAgIDxzcGFuIGNsYXNzPVxcXCJtZWFzdXJlXFxcIj5cIik7Xy5iKF8udihfLmYoXCJ0b25zRnVlbENoYW5nZVwiLGMscCwwKSkpO18uYihcIjwvc3Bhbj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgICAgaW4gZnVlbCBjb25zdW1wdGlvblwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPC9kaXY+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8ZGl2IGNsYXNzPVxcXCJjb3N0XFxcIj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgICAgPHNwYW4gY2xhc3M9XFxcIm1lYXN1cmVcXFwiPiRcIik7Xy5iKF8udihfLmYoXCJjb3N0Q2hhbmdlXCIsYyxwLDApKSk7Xy5iKFwiPC9zcGFuPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgICBpbiB2b3lhZ2UgY29zdHNcIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDwvZGl2PlwiKTtfLmIoXCJcXG5cIik7fSk7Yy5wb3AoKTt9aWYoIV8ucyhfLmYoXCJzaWduaWZpY2FudERpc3RhbmNlQ2hhbmdlXCIsYyxwLDEpLGMscCwxLDAsMCxcIlwiKSl7Xy5iKFwiICA8cCBjbGFzcz1cXFwic3VtbWFyeVxcXCI+Tm8gc2lnbmlmaWNhbnQgZGlmZmVyZW5jZSBmcm9tIGV4aXN0aW5nIGNvbmZpZ3VyYXRpb24uPC9wPlwiKTtfLmIoXCJcXG5cIik7fTtfLmIoXCI8L2Rpdj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIjxkaXYgY2xhc3M9XFxcInJlcG9ydFNlY3Rpb24gaGFiaXRhdCBcIik7Xy5iKF8udihfLmYoXCJsZW5ndGhDaGFuZ2VDbGFzc1wiLGMscCwwKSkpO18uYihcIlxcXCI+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8aDQ+U2Vuc2l0aXZlIEJsdWUgV2hhbGUgSGFiaXRhdDwvaDQ+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8cD5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgICAgPHNwYW4gY2xhc3M9XFxcIm1lYXN1cmVcXFwiPlwiKTtfLmIoXy52KF8uZihcImludGVyc2VjdGVkSXNvYmF0aE1cIixjLHAsMCkpKTtfLmIoXCIgc3F1YXJlIG1ldGVycyBvZiBzZW5zaXRpdmUgaGFiaXRhdCBkaXN0dXJiZWQuPC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJjaGFuZ2UgXCIpO18uYihfLnYoXy5mKFwiaXNvYmF0aENoYW5nZUNsYXNzXCIsYyxwLDApKSk7Xy5iKFwiXFxcIj5cIik7Xy5iKF8udihfLmYoXCJpc29iYXRoUGVyY2VudENoYW5nZVwiLGMscCwwKSkpO18uYihcIjwvc3Bhbj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDwvcD5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCI8L2Rpdj5cIik7Xy5iKFwiXFxuXCIpO3JldHVybiBfLmZsKCk7O30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNbXCJUZW1wbGF0ZXNcIl07Il19
;