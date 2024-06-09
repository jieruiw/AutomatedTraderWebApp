import React, { useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import { Selection } from 'd3';
import {HistoricalData} from "../types.ts";


type PortfolioGraphProps = {
    data: HistoricalData[];
};

const PortfolioGraph: React.FC<PortfolioGraphProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [width, setWidth] = useState<number>(window.innerWidth - 50);
    const [height, setHeight] = useState<number>(400);

    const handleResize = () => {
        setWidth(window.innerWidth - 50);
        setHeight(400);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    console.log(data);

    useEffect(() => {
        if (data.length === 0) return;

        const margin = { top: 20, right: 80, bottom: 30, left: 40 };

        // Create SVG element
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Clear previous content
        svg.selectAll('*').remove();

        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'line-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'steelblue')
            .attr('stop-opacity', 0.5);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'steelblue')
            .attr('stop-opacity', 0);

        const parsedData = data.map(d => ({
            ...d,
            date: new Date(d.newDate),
            value: +d.value,
        }));

        // Set up scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(parsedData, d => d.value), d3.max(parsedData, d=>d.value)] as [number, number])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Create axes
        const xAxis = (g: Selection<SVGGElement, unknown, null, undefined>) => g
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0));

        const yAxis = (g: Selection<SVGGElement, unknown, null, undefined>) => g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale))
            .call((g: Selection<SVGGElement, unknown, null, undefined>) => g.select(".domain").remove());

        // Draw axes
        svg.append('g').call(xAxis);
        svg.append('g').call(yAxis);

        // Create area generator
        const area = d3.area<HistoricalData>()
            .x(d => xScale(d.date))
            .y0(height - margin.bottom)
            .y1(d => yScale(d.value));

        // Draw area
        svg.append('path')
            .datum(parsedData)
            .attr('fill', 'url(#line-gradient)')
            .attr('d', area);

        // Create line generator
        const line = d3.line<HistoricalData>()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));

        // Draw line
        svg.append('path')
            .datum(parsedData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line);

    }, [data, height, width]);

    return <svg ref={svgRef}></svg>;
};

export default PortfolioGraph;