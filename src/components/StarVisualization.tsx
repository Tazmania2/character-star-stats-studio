import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Area, Level, PlayerStats } from '../types/models';

/**
 * Props for the StarVisualization component
 */
export interface StarVisualizationProps {
  areas: Area[];
  levels: Level[];
  playerStats?: PlayerStats;
  onAreaClick: (areaId: string) => void;
}

/**
 * StarVisualization component renders a star-shaped visualization
 * of Character Star Stats areas and levels using D3.js
 */
export const StarVisualization: React.FC<StarVisualizationProps> = ({
  areas,
  levels,
  playerStats,
  onAreaClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || areas.length === 0) {
      return;
    }

    // Get container dimensions for responsive sizing
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 40; // Leave margin

    // Clear previous visualization
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Set up SVG dimensions
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create main group for transformations
    const mainGroup = svg.append('g')
      .attr('class', 'star-visualization');

    // Initialize scales
    // Scale for spoke lengths based on number of levels per area
    const maxLevels = Math.max(
      ...areas.map(area => 
        levels.filter(level => level.area === area._id).length
      ),
      1 // Minimum of 1 to avoid division by zero
    );

    const radiusScale = d3.scaleLinear()
      .domain([0, maxLevels])
      .range([0, maxRadius]);

    // Store visualization data for later use
    (svg.node() as any).__data__ = {
      centerX,
      centerY,
      radiusScale,
      areas,
      levels,
      playerStats,
      onAreaClick,
    };

    // Draw the star visualization
    drawStar(mainGroup, centerX, centerY, radiusScale, areas, levels);

    // Draw player progress overlay if available
    if (playerStats) {
      drawPlayerProgress(mainGroup, centerX, centerY, radiusScale, areas, levels, playerStats);
    }

  }, [areas, levels, playerStats, onAreaClick]);

/**
 * Helper function to calculate star points based on areas and levels
 */
interface StarPoint {
  area: Area;
  angle: number;
  radius: number;
  x: number;
  y: number;
  levelCount: number;
}

function calculateStarPoints(
  centerX: number,
  centerY: number,
  radiusScale: d3.ScaleLinear<number, number>,
  areas: Area[],
  levels: Level[]
): StarPoint[] {
  const numAreas = areas.length;
  
  return areas.map((area, index) => {
    // Calculate equal angles for each area (360° / number of areas)
    // Start from top (270° or -90°) and go clockwise
    const angle = (index * 360 / numAreas - 90) * (Math.PI / 180);
    
    // Calculate spoke length based on total levels in this area
    const levelCount = levels.filter(level => level.area === area._id).length;
    const radius = radiusScale(levelCount);
    
    // Calculate x, y coordinates
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return {
      area,
      angle,
      radius,
      x,
      y,
      levelCount,
    };
  });
}

/**
 * Draw the star shape with spokes and connecting lines
 */
function drawStar(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  centerX: number,
  centerY: number,
  radiusScale: d3.ScaleLinear<number, number>,
  areas: Area[],
  levels: Level[]
): void {
  const points = calculateStarPoints(centerX, centerY, radiusScale, areas, levels);
  
  if (points.length === 0) return;

  // Get onAreaClick from stored data
  const svgNode = group.node()?.ownerSVGElement;
  const onAreaClick = svgNode ? (svgNode as any).__data__?.onAreaClick : null;

  // Draw spokes from center to each area point
  group.selectAll('.spoke')
    .data(points)
    .enter()
    .append('line')
    .attr('class', 'spoke')
    .attr('x1', centerX)
    .attr('y1', centerY)
    .attr('x2', d => d.x)
    .attr('y2', d => d.y)
    .attr('stroke', '#94a3b8')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,5')
    .style('transition', 'all 0.3s ease');

  // Connect points to form star shape
  if (points.length > 2) {
    const lineGenerator = d3.line<StarPoint>()
      .x(d => d.x)
      .y(d => d.y);
    
    // Close the path by adding the first point at the end
    const closedPoints = [...points, points[0]];
    
    group.append('path')
      .datum(closedPoints)
      .attr('class', 'star-outline')
      .attr('d', lineGenerator)
      .attr('fill', 'rgba(59, 130, 246, 0.1)')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease');
  }

  // Draw center point
  group.append('circle')
    .attr('cx', centerX)
    .attr('cy', centerY)
    .attr('r', 5)
    .attr('fill', '#3b82f6');

  // Create interactive area groups
  const areaGroups = group.selectAll('.area-group')
    .data(points)
    .enter()
    .append('g')
    .attr('class', 'area-group')
    .style('cursor', 'pointer');

  // Draw area points with interactivity
  areaGroups.append('circle')
    .attr('class', 'area-point')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 8)
    .attr('fill', '#3b82f6')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);

  // Add area labels
  areaGroups.append('text')
    .attr('class', 'area-label')
    .attr('x', d => {
      // Position label outside the point
      const offset = 20;
      return d.x + offset * Math.cos(d.angle);
    })
    .attr('y', d => {
      const offset = 20;
      return d.y + offset * Math.sin(d.angle);
    })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#1e293b')
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .text(d => d.area.title);

  // Add hover and touch effects
  areaGroups
    .on('mouseenter', function(_event, d) {
      // Highlight the area point
      d3.select(this).select('.area-point')
        .transition()
        .duration(200)
        .attr('r', 12)
        .attr('fill', '#2563eb');

      // Show tooltip
      showTooltip(group, d);
    })
    .on('mouseleave', function() {
      // Reset the area point
      d3.select(this).select('.area-point')
        .transition()
        .duration(200)
        .attr('r', 8)
        .attr('fill', '#3b82f6');

      // Hide tooltip
      hideTooltip(group);
    })
    .on('touchstart', function(event, d) {
      event.preventDefault();
      // Highlight the area point
      d3.select(this).select('.area-point')
        .transition()
        .duration(200)
        .attr('r', 12)
        .attr('fill', '#2563eb');

      // Show tooltip
      showTooltip(group, d);
    })
    .on('touchend', function(event, d) {
      event.preventDefault();
      // Reset the area point
      d3.select(this).select('.area-point')
        .transition()
        .duration(200)
        .attr('r', 8)
        .attr('fill', '#3b82f6');

      // Hide tooltip after delay
      setTimeout(() => hideTooltip(group), 1000);
      
      // Trigger click
      if (onAreaClick) {
        onAreaClick(d.area._id);
      }
    })
    .on('click', function(_event, d) {
      if (onAreaClick) {
        onAreaClick(d.area._id);
      }
    });
}

/**
 * Show tooltip with area information
 */
function showTooltip(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  point: StarPoint
): void {
  // Remove existing tooltip
  group.selectAll('.tooltip').remove();

  const tooltip = group.append('g')
    .attr('class', 'tooltip');

  // Tooltip background
  const text = tooltip.append('text')
    .attr('x', point.x)
    .attr('y', point.y - 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-weight', '600')
    .attr('fill', '#1e293b');

  text.append('tspan')
    .attr('x', point.x)
    .attr('dy', 0)
    .text(point.area.title);

  text.append('tspan')
    .attr('x', point.x)
    .attr('dy', '1.2em')
    .attr('font-size', '12px')
    .attr('font-weight', '400')
    .attr('fill', '#64748b')
    .text(`${point.levelCount} level${point.levelCount !== 1 ? 's' : ''}`);

  // Get text bounding box for background
  const bbox = (text.node() as SVGTextElement).getBBox();
  
  tooltip.insert('rect', 'text')
    .attr('x', bbox.x - 8)
    .attr('y', bbox.y - 4)
    .attr('width', bbox.width + 16)
    .attr('height', bbox.height + 8)
    .attr('fill', 'white')
    .attr('stroke', '#e2e8f0')
    .attr('stroke-width', 1)
    .attr('rx', 4);
}

/**
 * Hide tooltip
 */
function hideTooltip(
  group: d3.Selection<SVGGElement, unknown, null, undefined>
): void {
  group.selectAll('.tooltip')
    .transition()
    .duration(200)
    .style('opacity', 0)
    .remove();
}

/**
 * Draw player progress overlay on the star visualization
 */
function drawPlayerProgress(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  centerX: number,
  centerY: number,
  radiusScale: d3.ScaleLinear<number, number>,
  areas: Area[],
  levels: Level[],
  playerStats: PlayerStats
): void {
  const points = calculateStarPoints(centerX, centerY, radiusScale, areas, levels);
  
  if (points.length === 0) return;

  // Create a map of area stats for quick lookup
  const statsMap = new Map(
    playerStats.stats.map(stat => [stat.area, stat])
  );

  // Define progress point type
  interface ProgressPoint extends StarPoint {
    progress: number;
    progressX: number;
    progressY: number;
    progressRadius: number;
    hasProgress: boolean;
    stat?: typeof playerStats.stats[0];
  }

  // Calculate progress points for each area
  const progressPoints: ProgressPoint[] = points.map(point => {
    const stat = statsMap.get(point.area._id);
    if (!stat) {
      return { 
        ...point, 
        progress: 0, 
        progressX: centerX,
        progressY: centerY,
        progressRadius: 0,
        hasProgress: false 
      };
    }

    // Calculate progress radius based on completion percentage
    const progressRadius = point.radius * (stat.percent_completed / 100);
    const progressX = centerX + progressRadius * Math.cos(point.angle);
    const progressY = centerY + progressRadius * Math.sin(point.angle);

    return {
      ...point,
      progress: stat.percent_completed,
      progressX,
      progressY,
      progressRadius,
      hasProgress: true,
      stat,
    };
  });

  // Draw progress overlay shape
  if (progressPoints.length > 2) {
    const lineGenerator = d3.line<ProgressPoint>()
      .x(d => d.hasProgress ? d.progressX : centerX)
      .y(d => d.hasProgress ? d.progressY : centerY);
    
    // Close the path
    const closedProgressPoints = [...progressPoints, progressPoints[0]];
    
    // Draw filled progress area
    group.insert('path', '.star-outline')
      .datum(closedProgressPoints)
      .attr('class', 'progress-overlay')
      .attr('d', lineGenerator)
      .attr('fill', 'rgba(34, 197, 94, 0.3)')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)
      .style('pointer-events', 'none');
  }

  // Draw progress spokes
  progressPoints.forEach(point => {
    if (point.hasProgress && point.progress > 0) {
      group.insert('line', '.spoke')
        .attr('class', 'progress-spoke')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', point.progressX)
        .attr('y2', point.progressY)
        .attr('stroke', '#22c55e')
        .attr('stroke-width', 3)
        .style('pointer-events', 'none');
    }
  });

  // Draw progress points
  const progressGroup = group.selectAll('.progress-point')
    .data(progressPoints.filter(p => p.hasProgress && p.progress > 0))
    .enter()
    .append('g')
    .attr('class', 'progress-point');

  progressGroup.append('circle')
    .attr('cx', d => d.progressX)
    .attr('cy', d => d.progressY)
    .attr('r', 6)
    .attr('fill', '#22c55e')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('pointer-events', 'none');

  // Add progress percentage labels
  progressGroup.append('text')
    .attr('x', d => {
      const offset = 15;
      return d.progressX + offset * Math.cos(d.angle);
    })
    .attr('y', d => {
      const offset = 15;
      return d.progressY + offset * Math.sin(d.angle);
    })
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#15803d')
    .attr('font-size', '11px')
    .attr('font-weight', '700')
    .style('pointer-events', 'none')
    .text(d => `${Math.round(d.progress)}%`);

  // Add visual distinction for completed areas (100%)
  progressPoints.forEach(point => {
    if (point.hasProgress && point.progress >= 100) {
      // Add a star or checkmark icon at the area point
      group.append('circle')
        .attr('cx', point.x)
        .attr('cy', point.y)
        .attr('r', 12)
        .attr('fill', '#22c55e')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('pointer-events', 'none');

      // Add checkmark
      group.append('text')
        .attr('x', point.x)
        .attr('y', point.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#fff')
        .attr('font-size', '14px')
        .attr('font-weight', '700')
        .style('pointer-events', 'none')
        .text('✓');
    }
  });
}

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-gray-50 rounded-lg touch-none"
    >
      <svg ref={svgRef} className="w-full h-full touch-none" />
    </div>
  );
};
