import React, { useEffect, useState } from 'react';
import SankeyContainer from './components/Sankey/SankeyContainer';
import ElevationChart from './components/ElevationChart/ElevationChart';

const App = () => {
	const [data, setData] = useState(null);
	const [selection, setSelection] = useState(null);

	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/AustinRS016/Columbia-Dashboard/master/sankey-data.json'
		)
			.then((res) => res.json())
			.then((data) => setData(data));
	}, []);

	return (
		<div>
			{data ? (
				<>
					<SankeyContainer
						data={data}
						selection={selection}
						setSelection={setSelection}
					/>
					<ElevationChart
						data={data}
						selection={selection}
						setSelection={setSelection}
					/>
				</>
			) : null}
		</div>
	);
};

export default App;
