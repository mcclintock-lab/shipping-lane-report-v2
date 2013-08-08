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
    $el = $(this);
    view = $el.data('tocItem');
    if (view) {
      view.toggleVisibility(e);
      return $toggler.attr('data-visible', !!view.model.get('visible'));
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
    console.log(this.results);
    window.results = this.results;
    isobath = this.getResult('Habitats')[0];
    console.log(isobath);
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY2J1cnQvV29ya2luZy9zaGlwcGluZy1sYW5lLXJlcG9ydC9saWIvc2NyaXB0cy9lbmFibGVMYXllclRvZ2dsZXJzLmNvZmZlZSIsIi9Vc2Vycy9jYnVydC9Xb3JraW5nL3NoaXBwaW5nLWxhbmUtcmVwb3J0L2xpYi9zY3JpcHRzL3JlcG9ydFRhYi5jb2ZmZWUiLCIvVXNlcnMvY2J1cnQvV29ya2luZy9zaGlwcGluZy1sYW5lLXJlcG9ydC9zcmMvc2NyaXB0cy9zaGlwcGluZy5jb2ZmZWUiLCIvVXNlcnMvY2J1cnQvV29ya2luZy9zaGlwcGluZy1sYW5lLXJlcG9ydC9zcmMvc2NyaXB0cy9zaGlwcGluZ0xhbmVUYWIuY29mZmVlIiwiL1VzZXJzL2NidXJ0L1dvcmtpbmcvc2hpcHBpbmctbGFuZS1yZXBvcnQvc3JjL3NjcmlwdHMvc2lnaHRpbmdzVGVtcGxhdGUuY29mZmVlIiwiL1VzZXJzL2NidXJ0L1dvcmtpbmcvc2hpcHBpbmctbGFuZS1yZXBvcnQvc3JjL3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLENBQU8sQ0FBVSxDQUFBLEdBQVgsQ0FBTixFQUFrQjtDQUNoQixLQUFBLDJFQUFBO0NBQUEsQ0FBQSxDQUFBO0NBQUEsQ0FDQSxDQUFBLEdBQVk7Q0FEWixDQUVBLENBQUEsR0FBTTtBQUNDLENBQVAsQ0FBQSxDQUFBLENBQUE7Q0FDRSxFQUFBLENBQUEsR0FBTyxxQkFBUDtDQUNBLFNBQUE7SUFMRjtDQUFBLENBTUEsQ0FBVyxDQUFBLElBQVgsYUFBVztDQUVYO0NBQUEsTUFBQSxvQ0FBQTt3QkFBQTtDQUNFLEVBQVcsQ0FBWCxHQUFXLENBQVg7Q0FBQSxFQUNTLENBQVQsRUFBQSxFQUFpQixLQUFSO0NBQ1Q7Q0FDRSxFQUFPLENBQVAsRUFBQSxVQUFPO0NBQVAsRUFDTyxDQUFQLENBREEsQ0FDQTtBQUMrQixDQUYvQixDQUU4QixDQUFFLENBQWhD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QSxDQUVRLEVBQU4sT0FGRjtDQUFBLENBR2tCLEVBQWhCLFVBQUEsU0FIRjtDQUFBLENBSWtCLEVBQWhCLFVBQUE7Q0FKRixDQUtTLEVBQVAsQ0FBQTtFQUVGLEVBN0JlO0NBNkJmLENBQ0UsRUFBQSxHQURGO0NBQUEsQ0FFUSxFQUFOLFNBRkY7Q0FBQSxDQUdrQixFQUFoQixVQUFBLGNBSEY7Q0FBQSxDQUlrQixFQUFoQixVQUFBO0NBSkYsQ0FLUyxFQUFQLENBQUE7RUFFRixFQXBDZTtDQW9DZixDQUNFLEVBQUEsU0FERjtDQUFBLENBRVEsRUFBTixTQUZGO0NBQUEsQ0FHa0IsRUFBaEIsVUFBQSxjQUhGO0NBQUEsQ0FJa0IsRUFBaEIsVUFBQTtDQUpGLENBS1MsRUFBUCxDQUFBO0lBekNhO0NBQWpCLENBQUE7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSAoZWwpIC0+XG4gICRlbCA9ICQgZWxcbiAgYXBwID0gd2luZG93LmFwcFxuICB0b2MgPSBhcHAuZ2V0VG9jKClcbiAgdW5sZXNzIHRvY1xuICAgIGNvbnNvbGUubG9nICdObyB0YWJsZSBvZiBjb250ZW50cyBmb3VuZCdcbiAgICByZXR1cm5cbiAgdG9nZ2xlcnMgPSAkZWwuZmluZCgnYVtkYXRhLXRvZ2dsZS1ub2RlXScpXG4gICMgU2V0IGluaXRpYWwgc3RhdGVcbiAgZm9yIHRvZ2dsZXIgaW4gdG9nZ2xlcnMudG9BcnJheSgpXG4gICAgJHRvZ2dsZXIgPSAkKHRvZ2dsZXIpXG4gICAgbm9kZWlkID0gJHRvZ2dsZXIuZGF0YSgndG9nZ2xlLW5vZGUnKVxuICAgIHRyeVxuICAgICAgdmlldyA9IHRvYy5nZXRDaGlsZFZpZXdCeUlkIG5vZGVpZFxuICAgICAgbm9kZSA9IHZpZXcubW9kZWxcbiAgICAgICR0b2dnbGVyLmF0dHIgJ2RhdGEtdmlzaWJsZScsICEhbm9kZS5nZXQoJ3Zpc2libGUnKVxuICAgICAgJHRvZ2dsZXIuZGF0YSAndG9jSXRlbScsIHZpZXdcbiAgICBjYXRjaCBlXG4gICAgICAkdG9nZ2xlci5hdHRyICdkYXRhLW5vdC1mb3VuZCcsICd0cnVlJ1xuXG4gIHRvZ2dsZXJzLm9uICdjbGljaycsIChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICRlbCA9ICQoQClcbiAgICB2aWV3ID0gJGVsLmRhdGEoJ3RvY0l0ZW0nKVxuICAgIGlmIHZpZXdcbiAgICAgIHZpZXcudG9nZ2xlVmlzaWJpbGl0eShlKVxuICAgICAgJHRvZ2dsZXIuYXR0ciAnZGF0YS12aXNpYmxlJywgISF2aWV3Lm1vZGVsLmdldCgndmlzaWJsZScpXG4gICAgZWxzZVxuICAgICAgYWxlcnQgXCJMYXllciBub3QgZm91bmQgaW4gdGhlIGN1cnJlbnQgVGFibGUgb2YgQ29udGVudHMuIFxcbkV4cGVjdGVkIG5vZGVpZCAjeyRlbC5kYXRhKCd0b2dnbGUtbm9kZScpfVwiXG4iLCJjbGFzcyBSZXBvcnRUYWIgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3XG4gIG5hbWU6ICdJbmZvcm1hdGlvbidcbiAgZGVwZW5kZW5jaWVzOiBbXVxuXG4gIGluaXRpYWxpemU6IChAbW9kZWwsIEBvcHRpb25zKSAtPlxuICAgICMgV2lsbCBiZSBpbml0aWFsaXplZCBieSBTZWFTa2V0Y2ggd2l0aCB0aGUgZm9sbG93aW5nIGFyZ3VtZW50czpcbiAgICAjICAgKiBtb2RlbCAtIFRoZSBza2V0Y2ggYmVpbmcgcmVwb3J0ZWQgb25cbiAgICAjICAgKiBvcHRpb25zXG4gICAgIyAgICAgLSAucGFyZW50IC0gdGhlIHBhcmVudCByZXBvcnQgdmlldyBcbiAgICAjICAgICAgICBjYWxsIEBvcHRpb25zLnBhcmVudC5kZXN0cm95KCkgdG8gY2xvc2UgdGhlIHdob2xlIHJlcG9ydCB3aW5kb3dcbiAgICBAYXBwID0gd2luZG93LmFwcFxuICAgIF8uZXh0ZW5kIEAsIEBvcHRpb25zXG5cbiAgcmVuZGVyOiAoKSAtPlxuICAgIHRocm93ICdyZW5kZXIgbWV0aG9kIG11c3QgYmUgb3ZlcmlkZGVuJ1xuXG4gIHNob3c6ICgpIC0+XG4gICAgQCRlbC5zaG93KClcbiAgICBAdmlzaWJsZSA9IHRydWVcblxuICBoaWRlOiAoKSAtPlxuICAgIEAkZWwuaGlkZSgpXG4gICAgQHZpc2libGUgPSBmYWxzZVxuXG4gIHJlbW92ZTogKCkgPT5cbiAgICBzdXBlcigpXG4gIFxuICBvbkxvYWRpbmc6ICgpIC0+ICMgZXh0ZW5zaW9uIHBvaW50IGZvciBzdWJjbGFzc2VzXG5cbiAgZ2V0UmVzdWx0OiAoaWQpIC0+XG4gICAgcmVzdWx0cyA9IEBnZXRSZXN1bHRzKClcbiAgICByZXN1bHQgPSBfLmZpbmQgcmVzdWx0cywgKHIpIC0+IHIucGFyYW1OYW1lIGlzIGlkXG4gICAgdW5sZXNzIHJlc3VsdD9cbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmVzdWx0IHdpdGggaWQgJyArIGlkKVxuICAgIHJlc3VsdC52YWx1ZVxuXG4gIGdldEZpcnN0UmVzdWx0OiAocGFyYW0sIGlkKSAtPlxuICAgIHJlc3VsdCA9IEBnZXRSZXN1bHQocGFyYW0pXG4gICAgdHJ5XG4gICAgICByZXR1cm4gcmVzdWx0WzBdLmZlYXR1cmVzWzBdLmF0dHJpYnV0ZXNbaWRdXG4gICAgY2F0Y2ggZVxuICAgICAgdGhyb3cgXCJFcnJvciBmaW5kaW5nICN7cGFyYW19OiN7aWR9IGluIGdwIHJlc3VsdHNcIlxuXG4gIGdldFJlc3VsdHM6ICgpIC0+XG4gICAgdW5sZXNzIHJlc3VsdHMgPSBAcmVzdWx0cz8uZ2V0KCdkYXRhJyk/LnJlc3VsdHNcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZ3AgcmVzdWx0cycpXG4gICAgXy5maWx0ZXIgcmVzdWx0cywgKHJlc3VsdCkgLT5cbiAgICAgIHJlc3VsdC5wYXJhbU5hbWUgbm90IGluIFsnUmVzdWx0Q29kZScsICdSZXN1bHRNc2cnXVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcG9ydFRhYiIsIlNoaXBwaW5nTGFuZVRhYiA9IHJlcXVpcmUgJy4vc2hpcHBpbmdMYW5lVGFiLmNvZmZlZSdcblxud2luZG93LmFwcC5yZWdpc3RlclJlcG9ydCAocmVwb3J0KSAtPlxuICByZXBvcnQudGFicyBbU2hpcHBpbmdMYW5lVGFiXVxuICAjIHBhdGggbXVzdCBiZSByZWxhdGl2ZSB0byBkaXN0L1xuICByZXBvcnQuc3R5bGVzaGVldHMgWycuL21haW4uY3NzJ11cbiIsInNpZ2h0aW5nc1RlbXBsYXRlID0gcmVxdWlyZSAnLi9zaWdodGluZ3NUZW1wbGF0ZS5jb2ZmZWUnXG5SZXBvcnRUYWIgPSByZXF1aXJlICcuLi8uLi9saWIvc2NyaXB0cy9yZXBvcnRUYWIuY29mZmVlJ1xuZW5hYmxlTGF5ZXJUb2dnbGVycyA9IHJlcXVpcmUgJy4uLy4uL2xpYi9zY3JpcHRzL2VuYWJsZUxheWVyVG9nZ2xlcnMuY29mZmVlJ1xuXG5hZGRDb21tYXMgPSAoblN0cikgLT5cbiAgblN0ciArPSAnJ1xuICB4ID0gblN0ci5zcGxpdCgnLicpXG4gIHgxID0geFswXVxuICB4MiA9IGlmIHgubGVuZ3RoID4gMSB0aGVuICcuJyArIHhbMV0gZWxzZSAnJ1xuICByZ3ggPSAvKFxcZCspKFxcZHszfSkvXG4gIHdoaWxlIChyZ3gudGVzdCh4MSkpXG4gICAgeDEgPSB4MS5yZXBsYWNlKHJneCwgJyQxJyArICcsJyArICckMicpXG4gIHJldHVybiB4MSArIHgyXG5cbmNsYXNzIFNoaXBwaW5nTGFuZVJlcG9ydFRhYiBleHRlbmRzIFJlcG9ydFRhYlxuICBuYW1lOiAnU2hpcHBpbmcgTGFuZSBSZXBvcnQnXG4gIGNsYXNzTmFtZTogJ3NoaXBwaW5nTGFuZUluZm8nXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuLi90ZW1wbGF0ZXMvdGVtcGxhdGVzLmpzJykuc2hpcHBpbmdMYW5lUmVwb3J0XG4gIGV2ZW50czpcbiAgICBcImNsaWNrIGFbcmVsPXRvZ2dsZS1sYXllcl1cIiA6ICdfaGFuZGxlUmVwb3J0TGF5ZXJDbGljaydcbiAgICBcImNsaWNrIGEubW9yZVJlc3VsdHNcIjogICAgICAgICdvbk1vcmVSZXN1bHRzQ2xpY2snXG4gIGRlcGVuZGVuY2llczogWydMYW5lT3ZlcmxheSddXG5cbiAgcmVuZGVyOiAoKSAtPlxuICAgIGNvbnNvbGUubG9nIEByZXN1bHRzXG4gICAgd2luZG93LnJlc3VsdHMgPSBAcmVzdWx0c1xuICAgIGlzb2JhdGggPSBAZ2V0UmVzdWx0KCdIYWJpdGF0cycpWzBdXG4gICAgY29uc29sZS5sb2cgaXNvYmF0aFxuICAgICMgaXNvYmF0aCA9IEByZXN1bHRzLnJlc3VsdHNbMl1cbiAgICByaWdzID0gQGdldFJlc3VsdCgnUmlnc05lYXInKVswXVxuICAgIHdoYWxlU2lnaHRpbmdzID0gQGdldFJlc3VsdCgnV2hhbGVDb3VudCcpWzBdXG4gICAgc2lnaHRpbmdzID0ge31cbiAgICBmb3IgZmVhdHVyZSBpbiB3aGFsZVNpZ2h0aW5ncy5mZWF0dXJlc1xuICAgICAgc3BlY2llcyA9IGZlYXR1cmUuYXR0cmlidXRlcy5TcGVjaWVzXG4gICAgICB1bmxlc3Mgc3BlY2llcyBpbiBfLmtleXMoc2lnaHRpbmdzKVxuICAgICAgICBzaWdodGluZ3NbZmVhdHVyZS5hdHRyaWJ1dGVzLlNwZWNpZXNdID0gMFxuICAgICAgc2lnaHRpbmdzW3NwZWNpZXNdID0gc2lnaHRpbmdzW3NwZWNpZXNdICsgZmVhdHVyZS5hdHRyaWJ1dGVzLkZSRVFVRU5DWVxuICAgIHNpZ2h0aW5nc0RhdGEgPSBfLm1hcCBzaWdodGluZ3NUZW1wbGF0ZSwgKHMpIC0+IF8uY2xvbmUocylcbiAgICBmb3IgcmVjb3JkIGluIHNpZ2h0aW5nc0RhdGFcbiAgICAgIHJlY29yZC5jb3VudCA9IHNpZ2h0aW5nc1tyZWNvcmQuaWRdIGlmIHNpZ2h0aW5nc1tyZWNvcmQuaWRdXG4gICAgICByZWNvcmQuZGlmZiA9IHJlY29yZC5jb3VudCAtIHJlY29yZC51bmNoYW5nZWRDb3VudFxuICAgICAgcmVjb3JkLnBlcmNlbnRDaGFuZ2UgPSAgTWF0aC5yb3VuZCgoTWF0aC5hYnMocmVjb3JkLmRpZmYpL3JlY29yZC51bmNoYW5nZWRDb3VudCkgKiAxMDApXG4gICAgICBpZiByZWNvcmQucGVyY2VudENoYW5nZSBpcyBJbmZpbml0eSB0aGVuIHJlY29yZC5wZXJjZW50Q2hhbmdlID0gJz4xMDAnO1xuICAgICAgcmVjb3JkLmNoYW5nZUNsYXNzID0gaWYgcmVjb3JkLmRpZmYgPiAwIHRoZW4gJ3Bvc2l0aXZlJyBlbHNlICduZWdhdGl2ZSdcbiAgICAgIGlmIF8uaXNOYU4ocmVjb3JkLnBlcmNlbnRDaGFuZ2UpXG4gICAgICAgIHJlY29yZC5wZXJjZW50Q2hhbmdlID0gMFxuICAgICAgICByZWNvcmQuY2hhbmdlQ2xhc3MgPSAnbm9jaGFuZ2UnXG4gICAgYXJlYSA9IDBcbiAgICBmb3IgZmVhdHVyZSBpbiBpc29iYXRoLmZlYXR1cmVzXG4gICAgICBhcmVhID0gYXJlYSArIGZlYXR1cmUuYXR0cmlidXRlcy5TaGFwZV9BcmVhXG4gICAgcmlnSW50ZXJzZWN0aW9ucyA9IDBcbiAgICBmb3IgcmlnIGluIHJpZ3MuZmVhdHVyZXNcbiAgICAgIGlmIHJpZy5hdHRyaWJ1dGVzLk5FQVJfRElTVCA8IDUwMFxuICAgICAgICByaWdJbnRlcnNlY3Rpb25zID0gcmlnSW50ZXJzZWN0aW9ucyArIDFcbiAgICBvdmVybGFwc1JpZyA9IHJpZ0ludGVyc2VjdGlvbnMgPiAwXG4gICAgaW50ZXJzZWN0ZWRJc29iYXRoTSA9IGFyZWEgLyAxMDAwXG4gICAgZXhpc3RpbmdJc29iYXRoSW50ZXJzZWN0aW9uID0gNTQ5ODJcbiAgICBpc29iYXRoQ2hhbmdlID0gaW50ZXJzZWN0ZWRJc29iYXRoTSAtIGV4aXN0aW5nSXNvYmF0aEludGVyc2VjdGlvblxuICAgIGlzb2JhdGhDaGFuZ2VDbGFzcyA9IGlmIGlzb2JhdGhDaGFuZ2UgPiAwIHRoZW4gJ3Bvc2l0aXZlJyBlbHNlICduZWdhdGl2ZSdcbiAgICBpc29iYXRoUGVyY2VudENoYW5nZSA9IE1hdGgucm91bmQoKE1hdGguYWJzKGlzb2JhdGhDaGFuZ2UpIC8gZXhpc3RpbmdJc29iYXRoSW50ZXJzZWN0aW9uKSAqIDEwMClcbiAgICBleGlzdGluZ0xlbmd0aCA9IDEyMi43NVxuICAgIGxlbmd0aCA9IEBhcHAucHJvamVjdGhvbWVwYWdlLmdldExheWVyKEBtb2RlbCkuZ2V0R3JhcGhpY3MoQG1vZGVsKVswXS5za2V0Y2guZ2V0KCdnZW9tZXRyeScpLmZlYXR1cmVzWzBdLmF0dHJpYnV0ZXMuU2hhcGVfTGVuZ3RoIC8gNTA0OFxuICAgICNsZW5ndGggPSBAYXBwLnByb2plY3Rob21lcGFnZS5nZXRMYXllcihAbW9kZWwpLmdldEdyYXBoaWNzKEBtb2RlbClbMF0uYXR0cmlidXRlcy5TaGFwZV9MZW5ndGggLyA1MDQ4XG4gICAgd2luZG93LmdyYXBoaWNzID0gQGFwcC5wcm9qZWN0aG9tZXBhZ2UuZ2V0TGF5ZXIoQG1vZGVsKS5nZXRHcmFwaGljcyhAbW9kZWwpXG4gICAgcGVyY2VudENoYW5nZSA9IE1hdGguYWJzKCgoZXhpc3RpbmdMZW5ndGggLSBsZW5ndGgpIC8gZXhpc3RpbmdMZW5ndGgpICogMTAwKVxuICAgIGxlbmd0aEluY3JlYXNlZCA9IGV4aXN0aW5nTGVuZ3RoIC0gbGVuZ3RoIDwgMFxuICAgIGxlbmd0aENoYW5nZUNsYXNzID0gaWYgbGVuZ3RoSW5jcmVhc2VkIHRoZW4gJ3Bvc2l0aXZlJyBlbHNlICduZWdhdGl2ZSdcbiAgICBpZiBNYXRoLmFicyhleGlzdGluZ0xlbmd0aCAtIGxlbmd0aCkgPCAwLjAxXG4gICAgICBsZW5ndGhDaGFuZ2VDbGFzcyA9ICdub2NoYW5nZSdcbiAgICAjIGZyb20gaHR0cDovL3d3dy5icmVuLnVjc2IuZWR1L3Jlc2VhcmNoL2RvY3VtZW50cy93aGFsZXNfcmVwb3J0LnBkZlxuICAgICMgaW5jcmVhc2UgaW4gdm95YWdlIGNvc3QgcGVyIG5tXG4gICAgdmMgPSAzNTM1XG4gICAgIyBpbmNyZWFzZSBpbiBvcGVyYXRpbmcgY29zdHNcbiAgICBvYyA9IDIzMTVcbiAgICAjIHBhZ2UgNDAgbGlzdHMgbGFuZSBpbmNyZWFzZSBhcyAxMy44bm1cbiAgICBjb3N0SW5jcmVhc2VQZXJOTVBlclRyYW5zaXQgPSAodmMgKyBvYykgLyAxMy44XG4gICAgIyBJJ20gd29ya2luZyBiYWNrd29yZHMgaGVyZSwgc28gYWxsIHRoaXMgc2hpdCBpcyB0ZXJyaWJseSBpbmFjY3VyYXRlXG4gICAgZnVlbENvc3QgPSA2MjUgIyBwZXIgdG9uXG4gICAgIyBhc3N1bWVzIHZveWFnZSBjb3N0IGlzIGFsbCBmdWVsICh3cm9uZyAtIGlnbm9yaW5nIGx1YnJpY2FudCwgZG9jayBmZWVzLCBldGMpXG4gICAgdG9uc0Z1ZWxQZXJOTSA9ICh2YyAvIDEzLjgpIC8gNjI1XG4gICAgIyA1LDcyNSB0cmFuc2l0cyAtIHBhZ2UgODdcbiAgICBjb3N0SW5jcmVhc2VQZXJOTSA9IGNvc3RJbmNyZWFzZVBlck5NUGVyVHJhbnNpdCAqIDU3MjVcbiAgICBjb3N0Q2hhbmdlID0gTWF0aC5hYnMoY29zdEluY3JlYXNlUGVyTk0gKiAobGVuZ3RoIC0gZXhpc3RpbmdMZW5ndGgpKVxuICAgIHRvbnNGdWVsID0gdG9uc0Z1ZWxQZXJOTSAqIGxlbmd0aFxuICAgIGNvbnRleHQgPVxuICAgICAgc2lnbmlmaWNhbnREaXN0YW5jZUNoYW5nZTogTWF0aC5hYnMoZXhpc3RpbmdMZW5ndGggLSBsZW5ndGgpID4gMC4xXG4gICAgICBza2V0Y2hDbGFzczogQGFwcC5za2V0Y2hDbGFzc2VzLmdldChAbW9kZWwuZ2V0ICdza2V0Y2hjbGFzcycpLmZvclRlbXBsYXRlKClcbiAgICAgIHNrZXRjaDogQG1vZGVsLmZvclRlbXBsYXRlKClcbiAgICAgIGxlbmd0aDogTWF0aC5yb3VuZChsZW5ndGggKiAxMDApIC8gMTAwXG4gICAgICBsZW5ndGhDaGFuZ2VDbGFzczogbGVuZ3RoQ2hhbmdlQ2xhc3NcbiAgICAgIGxlbmd0aFBlcmNlbnRDaGFuZ2U6IE1hdGgucm91bmQocGVyY2VudENoYW5nZSAqIDEwKSAvIDEwXG4gICAgICBjb3N0Q2hhbmdlOiBhZGRDb21tYXMoTWF0aC5yb3VuZChjb3N0Q2hhbmdlICogMTAwKSAvIDEwMClcbiAgICAgIHRvbnNGdWVsUGVyVHJhbnNpdDogTWF0aC5yb3VuZCh0b25zRnVlbClcbiAgICAgIHRvbnNGdWVsQ2hhbmdlOiBNYXRoLnJvdW5kKCh0b25zRnVlbCAtICh0b25zRnVlbFBlck5NICogZXhpc3RpbmdMZW5ndGgpKSAqIDU3MjUpXG4gICAgICBsZW5ndGhDaGFuZ2U6IE1hdGgucm91bmQoKGxlbmd0aCAtIGV4aXN0aW5nTGVuZ3RoKSAqIDEwMCkgLyAxMDBcbiAgICAgIGludGVyc2VjdHNSaWc6IG92ZXJsYXBzUmlnXG4gICAgICB3aGFsZVNpZ2h0aW5nczogc2lnaHRpbmdzRGF0YVxuICAgICAgaW50ZXJzZWN0ZWRJc29iYXRoTTogYWRkQ29tbWFzKE1hdGgucm91bmQoaW50ZXJzZWN0ZWRJc29iYXRoTSkpXG4gICAgICBpc29iYXRoUGVyY2VudENoYW5nZTogaXNvYmF0aFBlcmNlbnRDaGFuZ2VcbiAgICAgIGlzb2JhdGhDaGFuZ2VDbGFzczogaXNvYmF0aENoYW5nZUNsYXNzXG5cbiAgICBAJGVsLmh0bWwgQHRlbXBsYXRlLnJlbmRlciBjb250ZXh0LCBAcGFydGlhbHNcblxuICAgIGVuYWJsZUxheWVyVG9nZ2xlcnMoQCRlbClcblxuICAgICMgU2hvdWxkbid0IHdlIGdpdmUgc29tZSBmZWVkYmFjayB0byB0aGUgdXNlciBpZiB0aGUgbGF5ZXIgaXNuJ3QgcHJlc2VudCBpbiB0aGUgbGF5ZXIgdHJlZT9cbiAgX2hhbmRsZVJlcG9ydExheWVyQ2xpY2s6IChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHVybCA9ICQoZS50YXJnZXQpLmF0dHIoJ2hyZWYnKVxuICAgIG5vZGUgPSB3aW5kb3cuYXBwLnByb2plY3Rob21lcGFnZS5kYXRhU2lkZWJhci5sYXllclRyZWUuZ2V0Tm9kZUJ5VXJsIHVybFxuICAgIG5vZGU/Lm1ha2VWaXNpYmxlKClcbiAgICBub2RlPy5tYWtlQWxsVmlzaWJsZUJlbG93KClcbiAgICBub2RlPy51cGRhdGVNYXAoKVxuICAgIGZhbHNlXG5cbiAgb25Nb3JlUmVzdWx0c0NsaWNrOiAoZSkgPT5cbiAgICBlPy5wcmV2ZW50RGVmYXVsdD8oKVxuICAgICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5yZXBvcnRTZWN0aW9uJykucmVtb3ZlQ2xhc3MgJ2NvbGxhcHNlZCdcblxubW9kdWxlLmV4cG9ydHMgPSBTaGlwcGluZ0xhbmVSZXBvcnRUYWIiLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAge1xuICAgIGlkOiAnQmx1ZSdcbiAgICBuYW1lOiAnQmx1ZSBXaGFsZSdcbiAgICBzY2llbnRpZmljTmFtZTogJ0JhbGFlbm9wdGVyYSBtdXNjdWx1cydcbiAgICB1bmNoYW5nZWRDb3VudDogMTUwXG4gICAgY291bnQ6IDBcbiAgfSxcbiAge1xuICAgIGlkOiAnSHVtcGJhY2snXG4gICAgbmFtZTogJ0h1bXBiYWNrIFdoYWxlJ1xuICAgIHNjaWVudGlmaWNOYW1lOiAnTWVnYXB0ZXJhIG5vdmFlYW5nbGlhZSdcbiAgICB1bmNoYW5nZWRDb3VudDogMjE4XG4gICAgY291bnQ6IDBcbiAgfSxcbiAge1xuICAgIGlkOiAnR3JheSdcbiAgICBuYW1lOiAnR3JheSBXaGFsZSdcbiAgICBzY2llbnRpZmljTmFtZTogJ0VzY2hyaWNodGl1cyByb2J1c3R1cydcbiAgICB1bmNoYW5nZWRDb3VudDogNDVcbiAgICBjb3VudDogMFxuICB9LFxuICB7XG4gICAgaWQ6ICdGaW4nXG4gICAgbmFtZTogJ0ZpbiBXaGFsZSdcbiAgICBzY2llbnRpZmljTmFtZTogJ0JhbGFlbm9wdGVyYSBwaHlzYWx1cydcbiAgICB1bmNoYW5nZWRDb3VudDogNlxuICAgIGNvdW50OiAwXG4gIH0sXG4gIHtcbiAgICBpZDogJ01pbmtlJ1xuICAgIG5hbWU6ICdNaW5rZSBXaGFsZSdcbiAgICBzY2llbnRpZmljTmFtZTogJ0JhbGFlbm9wdGVyYSBhY3V0b3Jvc3RyYXRhJ1xuICAgIHVuY2hhbmdlZENvdW50OiAxNlxuICAgIGNvdW50OiAwXG4gIH0sXG4gIHtcbiAgICBpZDogJ1BpbG90IFdoYWxlJ1xuICAgIG5hbWU6ICdQaWxvdCBXaGFsZSdcbiAgICBzY2llbnRpZmljTmFtZTogJ0dsb2JpY2VwaGFsYSBtYWNyb3JoeW5jaHVzJ1xuICAgIHVuY2hhbmdlZENvdW50OiAwXG4gICAgY291bnQ6IDBcbiAgfVxuXSIsInRoaXNbXCJUZW1wbGF0ZXNcIl0gPSB0aGlzW1wiVGVtcGxhdGVzXCJdIHx8IHt9O1xuXG50aGlzW1wiVGVtcGxhdGVzXCJdW1wic2hpcHBpbmdMYW5lUmVwb3J0XCJdID0gbmV3IEhvZ2FuLlRlbXBsYXRlKGZ1bmN0aW9uKGMscCxpKXt2YXIgXz10aGlzO18uYihpPWl8fFwiXCIpO2lmKF8ucyhfLmYoXCJpbnRlcnNlY3RzUmlnXCIsYyxwLDEpLGMscCwwLDE4LDI5NCxcInt7IH19XCIpKXtfLnJzKGMscCxmdW5jdGlvbihjLHAsXyl7Xy5iKFwiPGRpdiBjbGFzcz1cXFwicmVwb3J0U2VjdGlvbiBvaWxSaWcgd2FybmluZyBcIik7Xy5iKF8udihfLmYoXCJsZW5ndGhDaGFuZ2VDbGFzc1wiLGMscCwwKSkpO18uYihcIlxcXCI+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8aDQ+T2lsIFBsYXRmb3JtIEludGVyc2VjdGlvbjwvaDQ+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8cD5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgICAgWW91ciBwcm9wb3NhbCBvdmVybGFwcyB0aGUgc2FmZXR5IGFyZWEgYXJvdW5kIGFuIG9pbCBwbGF0Zm9ybSFcIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgICAgPGJyPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPC9wPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPGEgaHJlZj1cXFwiI1xcXCIgZGF0YS10b2dnbGUtbm9kZT1cXFwiNTFmMmI0NTVjOTYwMDNkYzEzMDEzZTg0XFxcIj5zaG93IHBsYXRmb3JtczwvYT5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCI8L2Rpdj5cIik7Xy5iKFwiXFxuXCIpO30pO2MucG9wKCk7fV8uYihcIlxcblwiICsgaSk7Xy5iKFwiPGRpdiBjbGFzcz1cXFwicmVwb3J0U2VjdGlvbiBzaWdodGluZ3MgXCIpO18uYihfLnYoXy5mKFwibGVuZ3RoQ2hhbmdlQ2xhc3NcIixjLHAsMCkpKTtfLmIoXCIgY29sbGFwc2VkXFxcIj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDxoND5XaGFsZSBTaWdodGluZ3M8L2g0PlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPHA+TnVtYmVyIG9mIHdoYWxlIHNpZ2h0aW5ncyB3aXRoaW4gdGhpcyBmb290cHJpbnQgY29tcGFyZWQgdG8gZXhpc3Rpbmcgc2hpcHBpbmcgbGFuZXMuIFNpZ2h0aW5ncyBhcmUgcmVjb3JkZWQgYnkgd2hhbGV3YXRjaGluZyB2ZXNzZWxzLjwvcD5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDx1bCBjbGFzcz1cXFwic2lnaHRpbmdzXFxcIj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtpZihfLnMoXy5mKFwid2hhbGVTaWdodGluZ3NcIixjLHAsMSksYyxwLDAsNjAwLDc3OSxcInt7IH19XCIpKXtfLnJzKGMscCxmdW5jdGlvbihjLHAsXyl7Xy5iKFwiICAgIDxsaSBjbGFzcz1cXFwiXCIpO18uYihfLnYoXy5mKFwiaWRcIixjLHAsMCkpKTtfLmIoXCJcXFwiPlwiKTtfLmIoXy52KF8uZihcIm5hbWVcIixjLHAsMCkpKTtfLmIoXCIgPHNwYW4gY2xhc3M9XFxcInNjaVxcXCI+XCIpO18uYihfLnYoXy5mKFwic2NpZW50aWZpY05hbWVcIixjLHAsMCkpKTtfLmIoXCI8L3NwYW4+PHNwYW4gY2xhc3M9XFxcImRpZmYgXCIpO18uYihfLnYoXy5mKFwiY2hhbmdlQ2xhc3NcIixjLHAsMCkpKTtfLmIoXCJcXFwiPlwiKTtfLmIoXy52KF8uZihcInBlcmNlbnRDaGFuZ2VcIixjLHAsMCkpKTtfLmIoXCI8L3NwYW4+PHNwYW4gY2xhc3M9XFxcImNvdW50XFxcIj5cIik7Xy5iKF8udihfLmYoXCJjb3VudFwiLGMscCwwKSkpO18uYihcIjwvc3Bhbj48L2xpPlwiKTtfLmIoXCJcXG5cIik7fSk7Yy5wb3AoKTt9Xy5iKFwiICA8L3VsPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPGEgY2xhc3M9XFxcIm1vcmVSZXN1bHRzXFxcIiBocmVmPVxcXCIjXFxcIj5tb3JlIHJlc3VsdHM8L2E+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8YSBocmVmPVxcXCIjXFxcIiBzdHlsZT1cXFwiZmxvYXQ6cmlnaHQ7XFxcIiBkYXRhLXRvZ2dsZS1ub2RlPVxcXCI1MWYyYjQ1NWM5NjAwM2RjMTMwMTNlNDVcXFwiPnNob3cgc2lnaHRpbmdzIGxheWVyPC9hPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIjwvZGl2PlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiPGRpdiBjbGFzcz1cXFwiY29zdHMgcmVwb3J0U2VjdGlvbiBcIik7Xy5iKF8udihfLmYoXCJsZW5ndGhDaGFuZ2VDbGFzc1wiLGMscCwwKSkpO18uYihcIlxcXCI+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8aDQ+RGlzdGFuY2UgYW5kIEZ1ZWwgQ29zdHM8L2g0PlwiKTtfLmIoXCJcXG5cIiArIGkpO2lmKF8ucyhfLmYoXCJzaWduaWZpY2FudERpc3RhbmNlQ2hhbmdlXCIsYyxwLDEpLGMscCwwLDEwOTMsMTUxMSxcInt7IH19XCIpKXtfLnJzKGMscCxmdW5jdGlvbihjLHAsXyl7Xy5iKFwiICA8cCBjbGFzcz1cXFwic3VtbWFyeVxcXCI+PHNwYW4gY2xhc3M9XFxcIm1lYXN1cmVcXFwiPlwiKTtfLmIoXy52KF8uZihcImxlbmd0aFBlcmNlbnRDaGFuZ2VcIixjLHAsMCkpKTtfLmIoXCI8L3NwYW4+IGVhY2ggeWVhciBmb3IgYWxsIHRyYW5zaXRzPC9wPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPGRpdiBjbGFzcz1cXFwiZGlzdGFuY2VcXFwiPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgICA8c3BhbiBjbGFzcz1cXFwibWVhc3VyZVxcXCI+XCIpO18uYihfLnYoXy5mKFwibGVuZ3RoQ2hhbmdlXCIsYyxwLDApKSk7Xy5iKFwiPC9zcGFuPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgICBjaGFuZ2UgaW4gbGVuZ3RoXCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8L2Rpdj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDxkaXYgY2xhc3M9XFxcImZ1ZWxcXFwiPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgICA8c3BhbiBjbGFzcz1cXFwibWVhc3VyZVxcXCI+XCIpO18uYihfLnYoXy5mKFwidG9uc0Z1ZWxDaGFuZ2VcIixjLHAsMCkpKTtfLmIoXCI8L3NwYW4+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICAgIGluIGZ1ZWwgY29uc3VtcHRpb25cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgIDwvZGl2PlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPGRpdiBjbGFzcz1cXFwiY29zdFxcXCI+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICAgIDxzcGFuIGNsYXNzPVxcXCJtZWFzdXJlXFxcIj4kXCIpO18uYihfLnYoXy5mKFwiY29zdENoYW5nZVwiLGMscCwwKSkpO18uYihcIjwvc3Bhbj5cIik7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCIgICAgaW4gdm95YWdlIGNvc3RzXCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8L2Rpdj5cIik7Xy5iKFwiXFxuXCIpO30pO2MucG9wKCk7fWlmKCFfLnMoXy5mKFwic2lnbmlmaWNhbnREaXN0YW5jZUNoYW5nZVwiLGMscCwxKSxjLHAsMSwwLDAsXCJcIikpe18uYihcIiAgPHAgY2xhc3M9XFxcInN1bW1hcnlcXFwiPk5vIHNpZ25pZmljYW50IGRpZmZlcmVuY2UgZnJvbSBleGlzdGluZyBjb25maWd1cmF0aW9uLjwvcD5cIik7Xy5iKFwiXFxuXCIpO307Xy5iKFwiPC9kaXY+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiXFxuXCIgKyBpKTtfLmIoXCI8ZGl2IGNsYXNzPVxcXCJyZXBvcnRTZWN0aW9uIGhhYml0YXQgXCIpO18uYihfLnYoXy5mKFwibGVuZ3RoQ2hhbmdlQ2xhc3NcIixjLHAsMCkpKTtfLmIoXCJcXFwiPlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPGg0PlNlbnNpdGl2ZSBCbHVlIFdoYWxlIEhhYml0YXQ8L2g0PlwiKTtfLmIoXCJcXG5cIiArIGkpO18uYihcIiAgPHA+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICAgIDxzcGFuIGNsYXNzPVxcXCJtZWFzdXJlXFxcIj5cIik7Xy5iKF8udihfLmYoXCJpbnRlcnNlY3RlZElzb2JhdGhNXCIsYyxwLDApKSk7Xy5iKFwiIHNxdWFyZSBtZXRlcnMgb2Ygc2Vuc2l0aXZlIGhhYml0YXQgZGlzdHVyYmVkLjwvc3Bhbj48c3BhbiBjbGFzcz1cXFwiY2hhbmdlIFwiKTtfLmIoXy52KF8uZihcImlzb2JhdGhDaGFuZ2VDbGFzc1wiLGMscCwwKSkpO18uYihcIlxcXCI+XCIpO18uYihfLnYoXy5mKFwiaXNvYmF0aFBlcmNlbnRDaGFuZ2VcIixjLHAsMCkpKTtfLmIoXCI8L3NwYW4+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiICA8L3A+XCIpO18uYihcIlxcblwiICsgaSk7Xy5iKFwiPC9kaXY+XCIpO18uYihcIlxcblwiKTtyZXR1cm4gXy5mbCgpOzt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzW1wiVGVtcGxhdGVzXCJdOyJdfQ==
;