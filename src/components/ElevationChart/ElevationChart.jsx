import React, { useMemo } from 'react';
import * as d3 from 'd3';

const ElevationChart = ({ data, selection, setSelection }) => {
	const svgWidth = 500;
	const svgHeight = 300;
	const margin = { top: 10, right: 10, bottom: 50, left: 40 },
		width = svgWidth - margin.right - margin.left,
		height = svgHeight - margin.top - margin.bottom;

	const elevationData = data.nodes
		.filter((d) => {
			return !d.link_key.includes('loss');
		})
		.sort((a, b) => a.elevation - b.elevation);

	const { xScale, yScale } = useMemo(() => {
		const xScale = d3
			.scaleBand()
			.domain(elevationData.map((d) => d.display_name))
			.range([0, width]);
		const yScale = d3
			.scaleLinear()
			.domain([d3.max(elevationData, (d) => d.elevation) * 1.1, 0])
			.range([0, height]);
		return { xScale, yScale };
	}, [data, selection]);

	return (
		<svg width={svgWidth} height={svgHeight}>
			{/*
                --- X AXIS ---
            */}
			<g
				className='axis-bottom'
				transform={`translate(${margin.left},${height + margin.top})`}
			>
				{/* Line */}
				<line x1={0} x2={width} y={height} stroke='black' />
				{/* Create ticks and labels */}
				{xScale.domain().map((d, i) => {
					return (
						<g
							key={d}
							transform={`translate(${xScale(d) + xScale.bandwidth() / 2}, 0)`}
						>
							<line y2='6' stroke='black' />
							<text
								y={15}
								fill='black'
								className='x-tick-labels'
								transform='rotate(30)'
								fontSize={12}
							>
								{elevationData.find((n) => n.display_name == d).link_key}
							</text>
						</g>
					);
				})}
			</g>
			{/* 
                --- Y AXIS ---
            */}
			<g
				className='axis-top'
				transform={`translate(${margin.left}, ${margin.top})`}
			>
				{/* Line */}
				<line y1={0} y2={height} x1={0} stroke='grey' />
				{/* Create labels*/}
				{yScale.ticks().map((value, i) => {
					return (
						<g key={value} transform={`translate(-5, ${yScale(value) + 2})`}>
							<text
								x={0}
								fill='black'
								className='y-tick-labels'
								textAnchor='end'
							>
								{value}
							</text>
						</g>
					);
				})}
			</g>
			{/* 
                --- HORIZONTAL GRIDLINES ---
            */}
			<g
				className='grid-lines'
				transform={`translate(${margin.left}, ${margin.top})`}
			>
				{yScale.ticks().map((value, i) => {
					if (i == yScale.ticks().length - 1) return null;
					return (
						<line
							key={value + 'grid-line'}
							x1={0}
							x2={width}
							y1={yScale(value)}
							y2={yScale(value)}
							stroke='grey'
						/>
					);
				})}
			</g>
			{/* 
                --- CIRCLES ---
            */}
			<g
				className='circles'
				transform={`translate(${margin.left}, ${margin.top})`}
			>
				{elevationData.map((d, i) => {
					return (
						<circle
							cx={xScale(d.display_name) + xScale.bandwidth() / 2}
							cy={yScale(d.elevation)}
							r='5px'
						/>
					);
				})}
			</g>
		</svg>
	);
};

export default ElevationChart;
