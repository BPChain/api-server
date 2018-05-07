const testLogs = {

  /* eslint-disable max-len */
  expectedResult: '{"repetitions":1,"nodes":[{"name":"mangofarmer_#0","transactions":[{"date":"2018-04-23T14:27:05.037+02:00","size":"harvested","delta":0,"quantity":1},{"date":"2018-04-23T14:28:02.037+02:00","size":"harvested","delta":57000,"quantity":1}]},{"name":"truck_driver_#0","transactions":[{"date":"2018-04-23T14:27:08.037+02:00","size":"ready for packaging","delta":3000,"quantity":1},{"date":"2018-04-23T14:28:05.037+02:00","size":"ready for packaging","delta":57000,"quantity":1}]},{"name":"packing_house_staff_#0","transactions":[{"date":"2018-04-23T14:27:11.037+02:00","size":"packaged","delta":6000,"quantity":1},{"date":"2018-04-23T14:28:08.037+02:00","size":"packaged","delta":57000,"quantity":1}]},{"name":"airline_staff_#0","transactions":[{"date":"2018-04-23T14:27:14.037+02:00","size":"air","delta":9000,"quantity":1}]},{"name":"facility_center_staff_#0","transactions":[{"date":"2018-04-23T14:27:17.037+02:00","size":"sorted","delta":12000,"quantity":1},{"date":"2018-04-23T14:28:32.037+02:00","size":"sorted","delta":75000,"quantity":1},{"date":"2018-04-23T14:28:35.037+02:00","size":"manufactured","delta":3000,"quantity":1}]},{"name":"supermarket_staff_#0","transactions":[{"date":"2018-04-23T14:27:20.037+02:00","size":"processed","delta":15000,"quantity":1},{"date":"2018-04-23T14:27:23.037+02:00","size":"processed","delta":3000,"quantity":1},{"date":"2018-04-23T14:29:02.037+02:00","size":"processed","delta":99000,"quantity":1},{"date":"2018-04-23T14:29:20.037+02:00","size":"processed","delta":18000,"quantity":2}]},{"name":"shipping_staff_#0","transactions":[{"date":"2018-04-23T14:28:11.037+02:00","size":"sea","delta":66000,"quantity":1}]}]}',
  unexpectedInput: 'thisIsNotAProperLog!',
  expectedInput: `<?xml version="1.0" encoding="UTF-8" ?>
  <!-- This file has been generated with the OpenXES library. It conforms -->
  <!-- to the XML serialization of the XES standard for log storage and -->
  <!-- management. -->
  <!-- XES standard version: 1.0 -->
  <!-- OpenXES library version: 1.0RC7 -->
  <!-- OpenXES is available from http://www.openxes.org/ -->
  <log xes.version="1.0" xes.features="nested-attributes" openxes.version="1.0RC7">
    <extension name="Organizational" prefix="org" uri="http://www.xes-standard.org/org.xesext"/>
    <extension name="Time" prefix="time" uri="http://www.xes-standard.org/time.xesext"/>
    <extension name="Lifecycle" prefix="lifecycle" uri="http://www.xes-standard.org/lifecycle.xesext"/>
    <extension name="Concept" prefix="concept" uri="http://www.xes-standard.org/concept.xesext"/>
    <global scope="trace">
      <string key="concept:name" value="__INVALID__"/>
    </global>
    <global scope="event">
      <string key="concept:name" value="__INVALID__"/>
      <string key="lifecycle:transition" value="complete"/>
    </global>
    <classifier name="MXML Legacy Classifier" keys="concept:name lifecycle:transition"/>
    <classifier name="Event Name" keys="concept:name"/>
    <classifier name="Resource" keys="org:resource"/>
    <classifier name="Event Name AND Resource" keys="concept:name org:resource"/>
    <string key="description" value="Log file created in Scylla"/>
    <string key="lifecycle:model" value="standard"/>
    <string key="source" value="Scylla"/>
    <string key="concept:name" value="Process_1"/>
    <trace>
      <string key="concept:name" value="1"/>
      <event>
        <string key="concept:name" value="Mango requested"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:02.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Created].payload" value="created"/>
        <string key="concept:name" value="Mango requested"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:27:02.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="mangofarmer_#0"/>
        <string key="concept:name" value="Harvest mangoes"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:02.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Harvested].payload" value="harvested"/>
        <string key="org:resource" value="mangofarmer_#0"/>
        <string key="concept:name" value="Harvest mangoes"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:27:05.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="truck_driver_#0"/>
        <string key="concept:name" value="Deliver to packing house"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:05.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="truck_driver_#0"/>
        <string key="Mango order [Ready for packaging].payload" value="ready for packaging"/>
        <string key="concept:name" value="Deliver to packing house"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:27:08.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="packing_house_staff_#0"/>
        <string key="concept:name" value="Package mangoes"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:08.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [packaged].payload" value="packaged"/>
        <string key="org:resource" value="packing_house_staff_#0"/>
        <string key="concept:name" value="Package mangoes"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:27:11.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Ship mangoes by air"/>
        <string key="lifecycle:transition" value="start"/>
        <string key="org:resource" value="airline_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:27:11.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Shipped by air].payload" value="air"/>
        <string key="concept:name" value="Ship mangoes by air"/>
        <string key="lifecycle:transition" value="complete"/>
        <string key="org:resource" value="airline_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:27:14.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="facility_center_staff_#0"/>
        <string key="concept:name" value="Sort mangoes"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:14.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Sorted].payload" value="sorted"/>
        <string key="org:resource" value="facility_center_staff_#0"/>
        <string key="concept:name" value="Sort mangoes"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:27:17.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Stock mango product"/>
        <string key="lifecycle:transition" value="start"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:27:17.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Stocked].payload" value="processed"/>
        <string key="concept:name" value="Stock mango product"/>
        <string key="lifecycle:transition" value="complete"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:27:20.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Sell mango product"/>
        <string key="lifecycle:transition" value="start"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:27:20.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Sold].payload" value="processed"/>
        <string key="concept:name" value="Sell mango product"/>
        <string key="lifecycle:transition" value="complete"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:27:23.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Yummy"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:23.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Yummy"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:27:23.037+02:00"/>
      </event>
    </trace>
    <trace>
      <string key="concept:name" value="20"/>
      <event>
        <string key="concept:name" value="Mango requested"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:59.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Created].payload" value="created"/>
        <string key="concept:name" value="Mango requested"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:27:59.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="mangofarmer_#0"/>
        <string key="concept:name" value="Harvest mangoes"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:27:59.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Harvested].payload" value="harvested"/>
        <string key="org:resource" value="mangofarmer_#0"/>
        <string key="concept:name" value="Harvest mangoes"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:28:02.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="truck_driver_#0"/>
        <string key="concept:name" value="Deliver to packing house"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:28:02.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="truck_driver_#0"/>
        <string key="Mango order [Ready for packaging].payload" value="ready for packaging"/>
        <string key="concept:name" value="Deliver to packing house"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:28:05.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="packing_house_staff_#0"/>
        <string key="concept:name" value="Package mangoes"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:28:05.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [packaged].payload" value="packaged"/>
        <string key="org:resource" value="packing_house_staff_#0"/>
        <string key="concept:name" value="Package mangoes"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:28:08.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Ship mangoes by sea"/>
        <string key="lifecycle:transition" value="start"/>
        <string key="org:resource" value="shipping_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:28:08.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Shipped by sea].payload" value="sea"/>
        <string key="concept:name" value="Ship mangoes by sea"/>
        <string key="lifecycle:transition" value="complete"/>
        <string key="org:resource" value="shipping_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:28:11.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="facility_center_staff_#0"/>
        <string key="concept:name" value="Sort mangoes"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:28:29.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Sorted].payload" value="sorted"/>
        <string key="org:resource" value="facility_center_staff_#0"/>
        <string key="concept:name" value="Sort mangoes"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:28:32.037+02:00"/>
      </event>
      <event>
        <string key="org:resource" value="facility_center_staff_#0"/>
        <string key="concept:name" value="Make mango jelly"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:28:32.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Manufactured].payload" value="manufactured"/>
        <string key="org:resource" value="facility_center_staff_#0"/>
        <string key="concept:name" value="Make mango jelly"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:28:35.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Stock mango product"/>
        <string key="lifecycle:transition" value="start"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:28:59.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Stocked].payload" value="processed"/>
        <string key="concept:name" value="Stock mango product"/>
        <string key="lifecycle:transition" value="complete"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:29:02.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Sell mango product"/>
        <string key="lifecycle:transition" value="start"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:29:17.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Sold].payload" value="processed"/>
        <string key="concept:name" value="Sell mango product"/>
        <string key="lifecycle:transition" value="complete"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:29:20.037+02:00"/>
      </event>
      <event>
        <string key="Mango order [Sold].payload" value="processed"/>
        <string key="concept:name" value="Sell mango product"/>
        <string key="lifecycle:transition" value="complete"/>
        <string key="org:resource" value="supermarket_staff_#0"/>
        <date key="time:timestamp" value="2018-04-23T14:29:20.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Yummy"/>
        <string key="lifecycle:transition" value="start"/>
        <date key="time:timestamp" value="2018-04-23T14:29:20.037+02:00"/>
      </event>
      <event>
        <string key="concept:name" value="Yummy"/>
        <string key="lifecycle:transition" value="complete"/>
        <date key="time:timestamp" value="2018-04-23T14:29:20.037+02:00"/>
      </event>
    </trace>
  </log>`,
}


module.exports = testLogs
