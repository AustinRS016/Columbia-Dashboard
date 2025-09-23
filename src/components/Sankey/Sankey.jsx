import React, { useMemo, useState, useEffect } from 'react';
import { sankey, sankeyLeft, sankeyLinkHorizontal } from 'd3-sankey';

const Sankey = ({ data, selection, setSelection, elevationColorScale }) => {
	const svgWidth = 1100;
	const svgHeight = 400;
	const margin = { top: 20, right: 60, bottom: 10, left: 40 };
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

	const handleMouseEnter = (link) => {
		const ids = [];
		ids.push(...retrieveLinks(link));
		setSelection({ node: link.target.link_key, links: ids });
	};

	const retrieveLinks = (link) => {
		const ids = [];
		ids.push(link.source.link_key + '-' + link.target.link_key);
		if (link.source.targetLinks[0]) {
			ids.push(...retrieveLinks(link.source.targetLinks[0]));
		}
		return ids;
	};
	return (
		<svg
			id='sankey-chart'
			viewBox={`0 0 ${svgWidth} ${svgHeight}`}
			width={svgWidth}
			height={svgHeight}
		>
			{/* Render links */}
			<g>
				{links.map((link, i) => {
					console.log(data);
					console.log(link);
					const key = link.source.link_key + '-' + link.target.link_key;
					const sourceElevation = data.nodes.find(
						(n) => n.link_key === link.source.link_key
					).elevation;
					const targetElevation = data.nodes.find(
						(n) => n.link_key === link.target.link_key
					).elevation;
					const color = elevationColorScale(
						sourceElevation + (targetElevation - sourceElevation) / 2
					);
					return (
						<path
							key={i}
							d={sankeyLinkHorizontal()(link)}
							stroke={link.target.link_key.includes('loss') ? 'grey' : color}
							strokeWidth={Math.max(2, link.width)}
							fill='none'
							opacity={1}
							className={`${key} ${
								selection?.links?.length && !selection.links.includes(key)
									? 'unselected'
									: null
							} `}
							onMouseEnter={() => handleMouseEnter(link)}
							onMouseLeave={() => setSelection(null)}
						/>
					);
				})}
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
						className={`${
							selection?.links?.length &&
							!selection.links.some((l) => l.includes(node.link_key))
								? 'unselected'
								: null
						} `}
					/>
				))}
			</g>
			{/* Render labels */}
			<g>
				{nodes.map((node, i) => {
					const isEnd = !data.links.some((l) => l.source == node.link_key);
					const displayName =
						node.display_name +
						(node.link_key.includes('_loss') ? ' Loss' : '');
					const displayValue = selection
						? selection?.links.some((l) => l.includes(node.link_key))
							? displayName
							: ''
						: node.link_key.replace('_loss', ' Loss');
					return (
						<foreignObject
							x={isEnd ? node.x0 + 5 : node.x0 - 40}
							y={(node.y1 + node.y0) / 2 - 40}
							width={80}
							height={80}
							pointerEvents={'none'}
						>
							<div className='dam-label-wrapper'>
								<div
									key={i}
									fontSize={12}
									fill='black'
									alignmentBaseline='middle'
									className={`dam-name ${isEnd ? 'end-node' : 'link-node'}`}
								>
									{displayValue}
								</div>
							</div>
						</foreignObject>
					);
				})}
			</g>
		</svg>
	);
};

export default Sankey;
