import React from 'react';
import ElevationChart from './ElevationChart';
import './ElevationChart.css';

const ElevationChartContainer = ({ data, selection, setSelection }) => {
	return (
		<div className='elevation-chart-container'>
			<ElevationChart
				data={data}
				selection={selection}
				setSelection={setSelection}
			/>
		</div>
	);
};

export default ElevationChartContainer;
