import React from 'react';
import Map from './Map';
import './Map.css';

const MapContainer = ({ data, linksData, selection, setSelection }) => {
	return (
		<div className='map-container'>
			<div className='map-chart'>
				<Map
					data={data}
					linksData={linksData}
					selection={selection}
					setSelectio={setSelection}
				/>
			</div>
		</div>
	);
};

export default MapContainer;
