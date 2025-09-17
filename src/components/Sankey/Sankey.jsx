import React, { useMemo } from 'react';
import { sankey, sankeyLeft, sankeyLinkHorizontal } from 'd3-sankey';

const Sankey = ({ data, selection, setSelection }) => {
	const svgWidth = 1000;
	const svgHeight = 400;
	const margin = { top: 20, right: 10, bottom: 10, left: 20 };
	const width = svgWidth - margin.left - margin.right;
	const height = svgHeight - margin.top - margin.bottom;

	// Calculate Sankey layout only when data changes
	const { nodes, links } = useMemo(() => {
		if (!data) return { nodes: [], links: [] };
		const sankeyInstance = sankey()
			.nodeId((d) => d.link_key)
			.nodeAlign(sankeyLeft)
			.nodeSort((a, b) => {
				const aParent = a.targetLinks[0]?.source?.link_key || '';
				const bParent = b.targetLinks[0]?.source?.link_key || '';
				return aParent.localeCompare(bParent);
			})
			.nodeWidth(2)
			.nodePadding(65)
			.extent([
				[margin.left, margin.top],
				[width, height],
			]);
		return sankeyInstance({
			nodes: data.nodes.map((n) => ({ ...n })),
			links: data.links.map((l) => ({ ...l })),
		});
	}, [data]);

	return (
		<svg
			id='sankey-chart'
			viewBox={`0 0 ${svgWidth} ${svgHeight}`}
			width={svgWidth}
			height={svgHeight}
		>
			{/* Render links */}
			<g>
				{links.map((link, i) => (
					<path
						key={i}
						d={sankeyLinkHorizontal()(link)}
						stroke={link.target.link_key.includes('loss') ? 'grey' : 'yellow'}
						strokeWidth={Math.max(2, link.width)}
						fill='none'
						opacity={1}
					/>
				))}
			</g>
			{/* Render nodes */}
			<g>
				{nodes.map((node, i) => (
					<rect
						key={i}
						x={node.x0}
						y={node.y0}
						width={node.x1 - node.x0}
						height={node.y1 - node.y0}
						fill={node.link_key.includes('loss') ? 'grey' : 'yellow'}
					/>
				))}
			</g>
			{/* Render labels */}
			<g>
				{nodes.map((node, i) => (
					<text
						key={i}
						x={node.x0 - 15}
						y={(node.y1 + node.y0) / 2}
						fontSize={12}
						fill='black'
						alignmentBaseline='middle'
					>
						{node.display_name}
						{node.display_name.includes('loss') ? ' Loss' : ''}
					</text>
				))}
			</g>
		</svg>
	);
};

export default Sankey;
