const testLogs = {

  /* eslint-disable max-len */
  expectedResult: '{"repetitions":1,"nodes":[{"name":"mangoFarmer_#0","transactions":[{"date":"2018-05-07T13:51:33.436+02:00","size":"30","delta":0,"quantity":1},{"date":"2018-05-07T13:52:13.436+02:00","size":"30","delta":40000,"quantity":1},{"date":"2018-05-07T13:52:53.436+02:00","size":"30","delta":40000,"quantity":1}]},{"name":"airlineStaff_#0","transactions":[{"date":"2018-05-07T13:52:23.436+02:00","size":"10","delta":50000,"quantity":1}]},{"name":"mangoFarmer_#1","transactions":[{"date":"2018-05-07T13:51:53.436+02:00","size":"30","delta":20000,"quantity":1},{"date":"2018-05-07T13:52:33.436+02:00","size":"30","delta":40000,"quantity":1}]},{"name":"shipStaff_#0","transactions":[{"date":"2018-05-07T13:53:33.436+02:00","size":"10","delta":120000,"quantity":1},{"date":"2018-05-07T13:55:13.436+02:00","size":"10","delta":100000,"quantity":1},{"date":"2018-05-07T13:56:53.436+02:00","size":"10","delta":100000,"quantity":1}]},{"name":"airlineStaff_#1","transactions":[{"date":"2018-05-07T13:53:43.436+02:00","size":"10","delta":130000,"quantity":1}]}]}',
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
			<date key="time:timestamp" value="2018-05-07T13:51:13.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:51:13.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:51:13.436+02:00"/>
			<string key="org:resource" value="mangoFarmer_#0"/>
		</event>
		<event>
			<string key="Mango order [Harvested].payload" value="30"/>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:51:33.436+02:00"/>
			<string key="org:resource" value="mangoFarmer_#0"/>
		</event>
		<event>
			<string key="org:resource" value="airlineStaff_#0"/>
			<string key="concept:name" value="Ship mangoes by air"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:51:33.436+02:00"/>
		</event>
		<event>
			<string key="Mango order [Shipped by air].payload" value="10"/>
			<string key="org:resource" value="airlineStaff_#0"/>
			<string key="concept:name" value="Ship mangoes by air"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:23.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="supermarketEmployee_#0"/>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:52:23.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="supermarketEmployee_#0"/>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:53.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:52:53.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:53.436+02:00"/>
		</event>
	</trace>
	<trace>
		<string key="concept:name" value="2"/>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:51:33.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:51:33.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="mangoFarmer_#1"/>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:51:33.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="mangoFarmer_#1"/>
			<string key="Mango order [Harvested].payload" value="30"/>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:51:53.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Ship mangoes by sea"/>
			<string key="lifecycle:transition" value="start"/>
			<string key="org:resource" value="shipStaff_#0"/>
			<date key="time:timestamp" value="2018-05-07T13:51:53.436+02:00"/>
		</event>
		<event>
			<string key="Mango order [Shipped by sea].payload" value="10"/>
			<string key="concept:name" value="Ship mangoes by sea"/>
			<string key="lifecycle:transition" value="complete"/>
			<string key="org:resource" value="shipStaff_#0"/>
			<date key="time:timestamp" value="2018-05-07T13:53:33.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="start"/>
			<string key="org:resource" value="supermarketEmployee_#2"/>
			<date key="time:timestamp" value="2018-05-07T13:53:33.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="complete"/>
			<string key="org:resource" value="supermarketEmployee_#2"/>
			<date key="time:timestamp" value="2018-05-07T13:54:03.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:54:03.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:54:03.436+02:00"/>
		</event>
	</trace>
	<trace>
		<string key="concept:name" value="3"/>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:51:53.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:51:53.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:51:53.436+02:00"/>
			<string key="org:resource" value="mangoFarmer_#0"/>
		</event>
		<event>
			<string key="Mango order [Harvested].payload" value="30"/>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:13.436+02:00"/>
			<string key="org:resource" value="mangoFarmer_#0"/>
		</event>
		<event>
			<string key="concept:name" value="Ship mangoes by sea"/>
			<string key="lifecycle:transition" value="start"/>
			<string key="org:resource" value="shipStaff_#0"/>
			<date key="time:timestamp" value="2018-05-07T13:53:33.436+02:00"/>
		</event>
		<event>
			<string key="Mango order [Shipped by sea].payload" value="10"/>
			<string key="concept:name" value="Ship mangoes by sea"/>
			<string key="lifecycle:transition" value="complete"/>
			<string key="org:resource" value="shipStaff_#0"/>
			<date key="time:timestamp" value="2018-05-07T13:55:13.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="supermarketEmployee_#0"/>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:55:13.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="supermarketEmployee_#0"/>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:55:43.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:55:43.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:55:43.436+02:00"/>
		</event>
	</trace>
	<trace>
		<string key="concept:name" value="4"/>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:52:13.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:13.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="mangoFarmer_#1"/>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:52:13.436+02:00"/>
		</event>
		<event>
			<string key="org:resource" value="mangoFarmer_#1"/>
			<string key="Mango order [Harvested].payload" value="30"/>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:33.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Ship mangoes by sea"/>
			<string key="lifecycle:transition" value="start"/>
			<string key="org:resource" value="shipStaff_#0"/>
			<date key="time:timestamp" value="2018-05-07T13:55:13.436+02:00"/>
		</event>
		<event>
			<string key="Mango order [Shipped by sea].payload" value="10"/>
			<string key="concept:name" value="Ship mangoes by sea"/>
			<string key="lifecycle:transition" value="complete"/>
			<string key="org:resource" value="shipStaff_#0"/>
			<date key="time:timestamp" value="2018-05-07T13:56:53.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="start"/>
			<string key="org:resource" value="supermarketEmployee_#2"/>
			<date key="time:timestamp" value="2018-05-07T13:56:53.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="complete"/>
			<string key="org:resource" value="supermarketEmployee_#2"/>
			<date key="time:timestamp" value="2018-05-07T13:57:23.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:57:23.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:57:23.436+02:00"/>
		</event>
	</trace>
	<trace>
		<string key="concept:name" value="5"/>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:52:33.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Mango requested"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:33.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:52:33.436+02:00"/>
			<string key="org:resource" value="mangoFarmer_#0"/>
		</event>
		<event>
			<string key="Mango order [Harvested].payload" value="30"/>
			<string key="concept:name" value="Harvest mangoes"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:52:53.436+02:00"/>
			<string key="org:resource" value="mangoFarmer_#0"/>
		</event>
		<event>
			<string key="org:resource" value="airlineStaff_#1"/>
			<string key="concept:name" value="Ship mangoes by air"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:52:53.436+02:00"/>
		</event>
		<event>
			<string key="Mango order [Shipped by air].payload" value="10"/>
			<string key="org:resource" value="airlineStaff_#1"/>
			<string key="concept:name" value="Ship mangoes by air"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:53:43.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:53:43.436+02:00"/>
			<string key="org:resource" value="supermarketEmployee_#1"/>
		</event>
		<event>
			<string key="concept:name" value="Sell mango product"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:54:13.436+02:00"/>
			<string key="org:resource" value="supermarketEmployee_#1"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="start"/>
			<date key="time:timestamp" value="2018-05-07T13:54:13.436+02:00"/>
		</event>
		<event>
			<string key="concept:name" value="Yummy"/>
			<string key="lifecycle:transition" value="complete"/>
			<date key="time:timestamp" value="2018-05-07T13:54:13.436+02:00"/>
		</event>
	</trace>
</log>`,
}


module.exports = testLogs
