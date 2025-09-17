import React from 'react';
import ElevationChart from './ElevationChart';

const ElevationChartContainer = ({ data, selection, setSelection }) => {
	return (
		<div>
			<ElevationChart
				data={data}
				selection={selection}
				setSelection={setSelection}
			/>
		</div>
	);
};

export default ElevationChartContainer;
