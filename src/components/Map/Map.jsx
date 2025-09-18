import React from 'react';
import * as d3 from 'd3';

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
 * @property {Dam[]} data
 * @property {StreamSegment[]} linksData
 * @property {any} selection
 * @property {function} setSelection
 */

/**
 *
 * @param {MapProps} param0
 * @returns
 */
const Map = ({ data, linksData, selection, setSelection }) => {
	const svgWidth = 500;
	const svgHeight = 500;
	const dataExtent = data.nodes.reduce(
		(acc, curr) => {
			const [currLon, currLat] = curr.lon_lat;
			return {
				xMin: Math.min(currLon, acc.xMin),
				yMin: Math.min(currLat, acc.yMin),
				xMax: Math.max(currLon, acc.xMax),
				yMax: Math.max(currLat, acc.yMax),
			};
		},
		{
			xMin: data.nodes[0].lon_lat[0],
			yMin: data.nodes[0].lon_lat[1],
			xMax: data.nodes[0].lon_lat[0],
			yMax: data.nodes[0].lon_lat[1],
		}
	);
	const centerLon = (dataExtent.xMin + dataExtent.xMax) / 2;
	const centerLat = (dataExtent.yMin + dataExtent.yMax) / 2;

	const projection = d3
		.geoMercator()
		.scale(5000)
		.center([centerLon, centerLat])
		.translate([svgWidth / 2, svgHeight / 2]);

	const pathGenerator = d3.geoPath().projection(projection);

	return (
		<svg id='map' width={svgWidth} height={svgHeight}>
			<g className='dams'>
				{data.nodes.map((d) => {
					if (d.link_key.includes('loss')) return;
					const [x, y] = projection(d.lon_lat);
					console.log({ x, y });
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
					console.log(link);

					return (
						<path d={pathGenerator(link.geometry)} stroke='red' fill='none' />
					);
				})}
			</g>
		</svg>
	);
};

export default Map;
