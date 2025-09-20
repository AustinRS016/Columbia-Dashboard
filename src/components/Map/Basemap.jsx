import {
	metersPerPixel,
	mercatorToLonLat,
	lonLatToMercator,
	metersPerPixelLocal,
} from './utils';

const Basemap = ({ projection }) => {
	const imageDimensions = {
		width: 1144,
		height: 768,
		center: [-121.34677080909901, 47.6100838767843],
		zoom: 6.2237973767103245,
	};

	// const { zoom, width, height, center } = imageDimensions;

	// const mppe = metersPerPixel(zoom);

	// const mpplat = metersPerPixelLocal(mppe, center[1]);

	// const halfWidth = (width / 2) * mpplat;
	// const halfHeight = (height / 2) * mpplat;

	// const centerMercator = lonLatToMercator(center[0], center[1]);

	// const xMin = centerMercator[0] - halfWidth,
	// 	xMax = centerMercator[0] + halfWidth,
	// 	yMin = centerMercator[1] - halfHeight,
	// 	yMax = centerMercator[1] + halfHeight;

	// const bottomLeftLonLat = mercatorToLonLat(xMin, yMin);
	// const topRightLonLat = mercatorToLonLat(xMax, yMax);

	// const imageGeo = {
	// 	type: 'Feature',
	// 	geometry: {
	// 		type: 'Polygon',
	// 		coordinates: [
	// 			[
	// 				[bottomLeftLonLat[0], bottomLeftLonLat[1]], // bottom-left
	// 				[topRightLonLat[0], bottomLeftLonLat[1]], // bottom-right
	// 				[topRightLonLat[0], topRightLonLat[1]], // top-right
	// 				[bottomLeftLonLat[0], topRightLonLat[1]], // top-left
	// 				[bottomLeftLonLat[0], bottomLeftLonLat[1]], // close polygon
	// 			],
	// 		],
	// 	},
	// };
	// console.log(imageGeo);
	// projection.fitSize([center[0], center[1]], imageGeo);

	// const imgBottomLeft = projection(bottomLeftLonLat);
	// const imgTopRight = projection(topRightLonLat);

	return;
};

export default Basemap;
