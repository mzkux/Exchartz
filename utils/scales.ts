import * as d3 from 'd3';

export function getScaleDomain(data: any[], accessor: (d: any) => any, padding: number = 0.1) {
  const values = data.map(accessor);
  const min = d3.min(values) as number;
  const max = d3.max(values) as number;
  
  const range = max - min;
  return [min - range * padding, max + range * padding];
}

export function createScale(
  type: 'linear' | 'time' | 'band' | 'log' = 'linear',
  domain: any[],
  range: [number, number],
  padding?: number
) {
  switch (type) {
    case 'linear':
      return d3.scaleLinear().domain(domain).range(range).nice();
    case 'time':
      return d3.scaleTime().domain(domain as Date[]).range(range);
    case 'band':
      return d3.scaleBand().domain(domain as string[]).range(range).padding(padding || 0.1);
    case 'log':
      return d3.scaleLog().domain(domain).range(range).nice();
    default:
      return d3.scaleLinear().domain(domain).range(range);
  }
}

export function generateTicks(scale: any, count: number = 5) {
  if (typeof scale.ticks === 'function') {
    return scale.ticks(count);
  }
  
  return scale.domain();
}
