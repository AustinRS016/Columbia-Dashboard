import Map from './Map';
import './Map.css';
import * as d3 from 'd3';
import { calculateImageBounds } from './utils';

const MapContainer = ({
	data,
	linksData,
	selection,
	setSelection,
	elevationColorScale,
}) => {
	const imageDimensions = {
		width: 1144,
		height: 768,
		center: [-121.34677080909901, 47.6100838767843],
		zoom: 6.2237973767103245,
	};

	const imageBounds = calculateImageBounds(imageDimensions);

	const projection = d3
		.geoMercator()
		.scale(6000)
		.center(imageDimensions.center)
		.translate([imageDimensions.width / 2, imageDimensions.height / 2]);

	return (
		<div className='map-container'>
			{linksData ? (
				<Map
					data={data}
					linksData={linksData}
					selection={selection}
					setSelection={setSelection}
					projection={projection}
					imageDimensions={imageDimensions}
					imageBounds={imageBounds}
					elevationColorScale={elevationColorScale}
				/>
			) : null}
		</div>
	);
};

export default MapContainer;
