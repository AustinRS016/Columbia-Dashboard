import React from 'react';
import Sankey from './Sankey';
import './Sankey.css';

const SankeyContainer = ({ data, selection, setSelection }) => {
	console.log({ data });
	return (
		<div id='sankey-container' className='overlay-chart'>
			<Sankey data={data} selection={selection} setSelection={setSelection} />
		</div>
	);
};

export default SankeyContainer;
