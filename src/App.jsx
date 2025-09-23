import React, { useEffect, useMemo, useState } from 'react';
import SankeyContainer from './components/Sankey/SankeyContainer';
import ElevationChart from './components/ElevationChart/ElevationChart';
import MapContainer from './components/Map/MapContainer';
import './App.css';
import ElevationChartContainer from './components/ElevationChart/ElevationChartContainer';
import * as d3 from 'd3';

const App = () => {
	const [data, setData] = useState(null);
	const [linksData, setLinksData] = useState(null);
	const [selection, setSelection] = useState(null);

	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/AustinRS016/Columbia-Dashboard/master/sankey-data.json'
		)
			.then((res) => res.json())
			.then((data) => setData(data));
		fetch(
			'https://raw.githubusercontent.com/AustinRS016/Columbia-Dashboard/refs/heads/master/links_geometry.json'
		)
			.then((res) => res.json())
			.then((data) => setLinksData(data));
	}, []);

	const elevationColorScale = useMemo(() => {
		if (!data?.nodes) return;
		const elevations = data.nodes.map((n) => n.elevation);
		return d3
			.scaleSequential()
			.domain([d3.min(elevations), d3.max(elevations)])
			.interpolator(d3.interpolatePlasma);
	}, [data]);

	return (
		<div className='App'>
			{data ? (
				<>
					<div className='overlay-charts'>
						<SankeyContainer
							data={data}
							selection={selection}
							setSelection={setSelection}
							elevationColorScale={elevationColorScale}
						/>
						<ElevationChartContainer
							data={data}
							selection={selection}
							setSelection={setSelection}
							elevationColorScale={elevationColorScale}
						/>
					</div>

					<MapContainer
						data={data}
						linksData={linksData}
						selection={selection}
						setSelection={setSelection}
						elevationColorScale={elevationColorScale}
					/>
				</>
			) : null}
		</div>
	);
};

export default App;
