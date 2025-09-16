import React, { useState } from 'react';
import SankeyContainer from './components/Sankey/SankeyContainer';

const App = () => {
	const [data, setData] = useState(null);
	const [selection, setSelection] = useState(null);

	return (
		<div>
			<h1>Welcome to My React App</h1>
			<SankeyContainer
				data={data}
				selection={selection}
				setSelection={setSelection}
			/>
		</div>
	);
};

export default App;
