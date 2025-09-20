import { useState } from 'react';
import * as d3 from 'd3';
import {
	calculateDataExtent,
	metersPerPixel,
	lonLatToMercator,
	mercatorToLonLat,
} from './utils';
import Basemap from './Basemap';

/**
 * @typedef {Object} StreamSegment
 * @property {string} source - Upstream node ID
 * @property {string} target - Downstream node ID
 * @property {Object} geometry - GeoJSON geometry object
 * @property {"LineString"} geometry.type - Geometry type
 * @property {Array<Array<number>>} geometry.coordinates - Array of [longitude, latitude] pairs
 */

/**
 * @typedef {Object} Dam
 * @property {string} link_key - Unique ID or key for the dam
 * @property {string} csv_key - Short name used in CSV or dataset
 * @property {string} display_name - Full display name of the dam
 * @property {number} elevation - Elevation of the dam (in feet)
 * @property {Array<number>} lon_lat - [longitude, latitude] coordinates
 */

/**
 * @typedef MapProps
 * @property {Object} data
 * @property {Dam[]} data.nodes
 * @property {StreamSegment[]} linksData
 * @property {any} selection
 * @property {function} setSelection
 */

/**
 *
 * @param {MapProps} param0
 * @returns
 */
const Map = ({
	data,
	linksData,
	selection,
	setSelection,
	projection,
	imageDimensions,
	imageBounds,
}) => {
	const pathGenerator = d3.geoPath().projection(projection);
	const { imageGeo, bottomLeftLonLat, topRightLonLat } = imageBounds;
	const [imgWidth, imgHeight] = projection([
		topRightLonLat[0],
		bottomLeftLonLat[1],
	]);

	const [x, y] = projection([bottomLeftLonLat[0], topRightLonLat[1]]);

	return (
		<svg
			id='map'
			viewBox={[0, 0, imgWidth, imgHeight]}
			preserveAspectRatio='xMidYMid meet'
		>
			<image
				x={0}
				y={0}
				width={imgWidth}
				height={imgHeight}
				href='/basemap.png'
			/>
			<g className='dams'>
				{data.nodes.map((d) => {
					if (d.link_key.includes('loss')) return;
					const [x, y] = projection(d.lon_lat);
					// console.log({ x, y });
					return (
						<g>
							<circle cx={x} cy={y} r={5} fill='red' />
							<text x={x} y={y}>
								{d.link_key}
							</text>
						</g>
					);
				})}
			</g>
			<g className='stream-links'>
				{linksData.map((link) => {
					return (
						<path d={pathGenerator(link.geometry)} stroke='red' fill='none' />
					);
				})}
			</g>
		</svg>
	);
};

export default Map;
