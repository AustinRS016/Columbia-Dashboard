import React from 'react';
import ElevationChart from './ElevationChart';
import './ElevationChart.css';

const ElevationChartContainer = ({
	data,
	selection,
	setSelection,
	elevationColorScale,
}) => {
	return (
		<div className='elevation-chart-container overlay-chart'>
			<ElevationChart
				data={data}
				selection={selection}
				setSelection={setSelection}
				elevationColorScale={elevationColorScale}
			/>
		</div>
	);
};

export default ElevationChartContainer;
