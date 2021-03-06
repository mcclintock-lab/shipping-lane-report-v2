ReportTab = require 'reportTab'
templates = require '../templates/templates.js'
_partials = require '../node_modules/seasketch-reporting-api/templates/templates.js'
partials = []
for key, val of _partials
  partials[key.replace('node_modules/seasketch-reporting-api/', '')] = val
sightingsTemplate = require './sightingsTemplate.coffee'

addCommas = (nStr) ->
  nStr += ''
  x = nStr.split('.')
  x1 = x[0]
  x2 = if x.length > 1 then '.' + x[1] else ''
  rgx = /(\d+)(\d{3})/
  while (rgx.test(x1))
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  return x1 + x2

class ShippingLaneReportTab extends ReportTab
  name: 'Shipping Lane Report'
  className: 'shippingLaneInfo'
  template: templates.shippingLaneReport
  events:
    "click a[rel=toggle-layer]" : '_handleReportLayerClick'
    "click a.moreResults":        'onMoreResultsClick'
  dependencies: ['ShippingLanes']

  render: () ->
    window.results = @results
    isobath = @recordSet('ShippingLanes', 'Habitats').toArray()[0]
    rigs = @recordSet('ShippingLanes', 'RigsNear').toArray()[0]
    whaleSightings = @recordSet('ShippingLanes', 'WhaleCount').toArray()

    sightings = {}
    for feature in whaleSightings
      species = feature.Species
      unless species in _.keys(sightings)
        sightings[feature.Species] = 0
      sightings[species] = sightings[species] + feature.Frequency
    sightingsData = _.map sightingsTemplate, (s) -> _.clone(s)

    for record in sightingsData
      record.count = sightings[record.id] if sightings[record.id]
      record.diff = record.count - record.unchangedCount
      record.percentChange =  Math.round((Math.abs(record.diff)/record.unchangedCount) * 100)
      if record.percentChange is Infinity then record.percentChange = '>100';
      record.changeClass = if record.diff > 0 then 'positive' else 'negative'
      if _.isNaN(record.percentChange) or record.percentChange == 0.0
        record.percentChange = 0
        record.changeClass = 'nochange'

    area = isobath.AREA/1000
    rigIntersections = rigs.NEAR_DIST
    
    overlapsRig = rigIntersections > 0
    intersectedIsobathM = area 
    existingIsobathIntersection = 54982
    isobathChange = Math.round(intersectedIsobathM) - existingIsobathIntersection
    isobathChangeClass = if isobathChange > 0 then 'positive' else 'negative'
    
    if isobathChange == 0
      isobathChangeClass = 'nochange'

    isobathPercentChange = Math.round((Math.abs(isobathChange) / existingIsobathIntersection) * 100)
    existingLength = 166
    length = Math.round(isobath.SIDE_LENGTH/1852)
    console.log("len: ", length)

    percentChange = Math.abs(((existingLength - length) / existingLength) * 100)
    lengthIncreased = existingLength - length < 0
    lengthChangeClass = if lengthIncreased then 'positive' else 'negative'
    console.log("length: ", lengthIncreased)
    if Math.abs(existingLength - length) < 0.01
      lengthChangeClass = 'nochange'
    # from http://www.bren.ucsb.edu/research/documents/whales_report.pdf
    # increase in voyage cost per nm
    vc = 3535
    # increase in operating costs
    oc = 2315
    # page 40 lists lane increase as 13.8nm
    costIncreasePerNMPerTransit = (vc + oc) / 13.8
    # I'm working backwords here, so all this shit is terribly inaccurate
    fuelCost = 625 # per ton
    # assumes voyage cost is all fuel (wrong - ignoring lubricant, dock fees, etc)
    tonsFuelPerNM = (vc / 13.8) / 625
    # 5,725 transits - page 87
    costIncreasePerNM = costIncreasePerNMPerTransit * 5725
    costChange = Math.abs(costIncreasePerNM * (length - existingLength))
    tonsFuel = tonsFuelPerNM * length
    context =
      significantDistanceChange: Math.abs(existingLength - length) > 0.1
      sketchClass: @app.sketchClasses.get(@model.get 'sketchclass').forTemplate()
      sketch: @model.forTemplate()
      length: Math.round(length * 100) / 100
      lengthChangeClass: lengthChangeClass
      lengthPercentChange: Math.round(percentChange * 10) / 10
      costChange: addCommas(Math.round(costChange * 100) / 100)
      tonsFuelPerTransit: Math.round(tonsFuel)
      tonsFuelChange: Math.round((tonsFuel - (tonsFuelPerNM * existingLength)) * 5725)
      lengthChange: Math.round((length - existingLength) * 100) / 100
      intersectsRig: overlapsRig
      whaleSightings: sightingsData
      intersectedIsobathM: addCommas(Math.round(intersectedIsobathM))
      isobathPercentChange: isobathPercentChange
      isobathChangeClass: isobathChangeClass

    @$el.html @template.render context, @partials

    @enableLayerTogglers(@$el)

    # Shouldn't we give some feedback to the user if the layer isn't present in the layer tree?
  _handleReportLayerClick: (e) ->
    e.preventDefault()
    url = $(e.target).attr('href')
    node = window.app.projecthomepage.dataSidebar.layerTree.getNodeByUrl url
    node?.makeVisible()
    node?.makeAllVisibleBelow()
    node?.updateMap()
    false

  onMoreResultsClick: (e) =>
    e?.preventDefault?()
    $(e.target).closest('.reportSection').removeClass 'collapsed'

module.exports = ShippingLaneReportTab
