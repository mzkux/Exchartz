# ExChartz

High-performance, customizable chart components for React Native and Expo built with Skia and Reanimated.

## Features

- 🚀 **High Performance**: Built with `react-native-skia` for high performance
- 📊 **Multiple Chart Types**: Area, Line, Bar, Pie, Radar charts
- 🎨 **Fully Customizable**: Colors, animations, styling, and layout options
- 📱 **Cross Platform**: Works on iOS, Android, and Expo
- 🔄 **Smooth Animations**: Powered by `react-native-reanimated`
- 📐 **Flexible Scaling**: Support for linear, log, band, and time scales
- 🎯 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🔧 **Composable**: Mix and match chart components within CartesianChart

## Installation

```bash
npm install exchartz
```

### Peer Dependencies

ExChartz requires the following peer dependencies:

```bash
npm install react-native-skia react-native-reanimated d3
```

For Expo projects:

```bash
expo install react-native-skia react-native-reanimated
npm install d3
```

**Note**: Make sure to follow the setup instructions for [react-native-skia](https://shopify.github.io/react-native-skia/docs/getting-started/installation) and [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) in your project.

## Basic Usage

### CartesianChart (Container)

The `CartesianChart` component provides the coordinate system and axes for other chart components.

```tsx
import React from "react";
import { CartesianChart, LineChart } from "exchartz";

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 25 },
  { x: 4, y: 18 },
];

export default function BasicChart() {
  return (
    <CartesianChart
      width={300}
      height={200}
      padding={{ left: 40, right: 20, top: 20, bottom: 40 }}
      xAxis={{ showAxis: true, showGrid: true }}
      yAxis={{ showAxis: true, showGrid: true }}
    >
      <LineChart data={data} lineColor="#3b82f6" strokeWidth={2} />
    </CartesianChart>
  );
}
```

### LineChart

```tsx
import React from "react";
import { CartesianChart, LineChart } from "exchartz";
import * as d3 from "d3";

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 25 },
  { x: 4, y: 18 },
];

export default function LineChartExample() {
  return (
    <CartesianChart width={300} height={200}>
      <LineChart
        data={data}
        lineColor="#ef4444"
        strokeWidth={3}
        curve={d3.curveCatmullRom}
        animated={true}
        animationDuration={1000}
      />
    </CartesianChart>
  );
}
```

### AreaChart

```tsx
import React from "react";
import { CartesianChart, AreaChart } from "exchartz";

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 25 },
  { x: 4, y: 18 },
];

export default function AreaChartExample() {
  return (
    <CartesianChart width={300} height={200}>
      <AreaChart
        data={data}
        areaColor="#10b981"
        opacity={0.7}
        animated={true}
        animationDuration={1200}
      />
    </CartesianChart>
  );
}
```

### BarChart

```tsx
import React from "react";
import { CartesianChart, BarChart } from "exchartz";

const data = [
  { x: "Jan", y: 10 },
  { x: "Feb", y: 20 },
  { x: "Mar", y: 15 },
  { x: "Apr", y: 25 },
  { x: "May", y: 18 },
];

export default function BarChartExample() {
  return (
    <CartesianChart width={300} height={200} xAxis={{ scaleType: "band" }}>
      <BarChart
        data={data}
        barColor={["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]}
        animated={true}
        animationDuration={800}
      />
    </CartesianChart>
  );
}
```

## API Documentation

### CartesianChart Props

| Prop              | Type         | Default      | Description                                      |
| ----------------- | ------------ | ------------ | ------------------------------------------------ |
| `width`           | `number`     | **Required** | Chart width in pixels                            |
| `height`          | `number`     | **Required** | Chart height in pixels                           |
| `padding`         | `object`     | `{}`         | Chart padding `{ left?, right?, top?, bottom? }` |
| `xAxis`           | `AxisConfig` | `{}`         | X-axis configuration                             |
| `yAxis`           | `AxisConfig` | `{}`         | Y-axis configuration                             |
| `backgroundColor` | `string`     | `undefined`  | Chart background color                           |
| `children`        | `ReactNode`  | **Required** | Chart components to render                       |

### AxisConfig Interface

| Property     | Type                                    | Default         | Description        |
| ------------ | --------------------------------------- | --------------- | ------------------ |
| `domain`     | `[number, number] \| string[]`          | Auto-calculated | Axis domain range  |
| `scaleType`  | `'linear' \| 'log' \| 'band' \| 'time'` | `'linear'`      | Scale type         |
| `showAxis`   | `boolean`                               | `true`          | Show axis line     |
| `showGrid`   | `boolean`                               | `false`         | Show grid lines    |
| `showTicks`  | `boolean`                               | `true`          | Show tick marks    |
| `showLabels` | `boolean`                               | `true`          | Show axis labels   |
| `axisColor`  | `string`                                | `'#000'`        | Axis line color    |
| `gridColor`  | `string`                                | `'#e5e5e5'`     | Grid line color    |
| `labelColor` | `string`                                | `'#000'`        | Label text color   |
| `tickLength` | `number`                                | `5`             | Tick mark length   |
| `tickCount`  | `number`                                | `5`             | Number of ticks    |
| `tickValues` | `number[] \| string[]`                  | Auto-calculated | Custom tick values |
| `label`      | `string`                                | `undefined`     | Axis label         |

### LineChart Props

| Prop                | Type               | Default          | Description              |
| ------------------- | ------------------ | ---------------- | ------------------------ |
| `data`              | `ChartDataPoint[]` | **Required**     | Chart data points        |
| `lineColor`         | `string`           | `'#000'`         | Line color               |
| `strokeWidth`       | `number`           | `2`              | Line stroke width        |
| `curve`             | `d3.CurveFactory`  | `d3.curveLinear` | D3 curve function        |
| `animated`          | `boolean`          | `false`          | Enable animations        |
| `animationDuration` | `number`           | `1000`           | Animation duration in ms |
| `animationDelay`    | `number`           | `0`              | Animation delay in ms    |

### AreaChart Props

| Prop                | Type               | Default          | Description              |
| ------------------- | ------------------ | ---------------- | ------------------------ |
| `data`              | `ChartDataPoint[]` | **Required**     | Chart data points        |
| `areaColor`         | `string`           | `'#000'`         | Area fill color          |
| `curve`             | `d3.CurveFactory`  | `d3.curveLinear` | D3 curve function        |
| `opacity`           | `number`           | `1`              | Area opacity             |
| `animated`          | `boolean`          | `false`          | Enable animations        |
| `animationDuration` | `number`           | `1000`           | Animation duration in ms |
| `animationDelay`    | `number`           | `0`              | Animation delay in ms    |

### BarChart Props

| Prop                | Type               | Default         | Description                |
| ------------------- | ------------------ | --------------- | -------------------------- |
| `data`              | `ChartDataPoint[]` | **Required**    | Chart data points          |
| `barColor`          | `string[]`         | `['#000']`      | Bar colors array           |
| `barWidth`          | `number`           | Auto-calculated | Bar width                  |
| `spacing`           | `number`           | `0.1`           | Spacing between bars       |
| `animated`          | `boolean`          | `false`         | Enable animations          |
| `animationDuration` | `number`           | `1000`          | Animation duration in ms   |
| `animationDelay`    | `number`           | `0`             | Animation delay in ms      |
| `horizontal`        | `boolean`          | `false`         | Horizontal bar orientation |
| `labelPadding`      | `number`           | `5`             | Label padding              |
| `font`              | `SkFont`           | `undefined`     | Font for labels            |

### ChartDataPoint Interface

```tsx
interface ChartDataPoint {
  x: number | string;
  y: number;
}
```

## Advanced Usage

### Multiple Chart Types

```tsx
import React from "react";
import { CartesianChart, LineChart, AreaChart } from "exchartz";

const lineData = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 25 },
];

const areaData = [
  { x: 0, y: 5 },
  { x: 1, y: 8 },
  { x: 2, y: 12 },
  { x: 3, y: 10 },
];

export default function CombinedChart() {
  return (
    <CartesianChart
      width={400}
      height={250}
      padding={{ left: 50, right: 30, top: 30, bottom: 50 }}
      xAxis={{
        showAxis: true,
        showGrid: true,
        label: "Time (hours)",
      }}
      yAxis={{
        showAxis: true,
        showGrid: true,
        label: "Value",
      }}
    >
      <AreaChart
        data={areaData}
        areaColor="#3b82f6"
        opacity={0.3}
        animated={true}
      />
      <LineChart
        data={lineData}
        lineColor="#ef4444"
        strokeWidth={3}
        animated={true}
        animationDelay={500}
      />
    </CartesianChart>
  );
}
```

### Custom Animations

```tsx
import React from "react";
import { CartesianChart, BarChart } from "exchartz";
import * as d3 from "d3";

const data = [
  { x: "Q1", y: 100 },
  { x: "Q2", y: 150 },
  { x: "Q3", y: 120 },
  { x: "Q4", y: 180 },
];

export default function AnimatedBarChart() {
  return (
    <CartesianChart
      width={350}
      height={300}
      padding={{ left: 60, right: 30, top: 30, bottom: 60 }}
      xAxis={{
        scaleType: "band",
        showAxis: true,
        showLabels: true,
      }}
      yAxis={{
        showAxis: true,
        showGrid: true,
        tickCount: 6,
      }}
      backgroundColor="#f8fafc"
    >
      <BarChart
        data={data}
        barColor={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
        animated={true}
        animationDuration={1500}
        animationDelay={200}
      />
    </CartesianChart>
  );
}
```

### Time Series Chart

```tsx
import React from "react";
import { CartesianChart, LineChart } from "exchartz";
import * as d3 from "d3";

const timeData = [
  { x: new Date("2024-01-01").getTime(), y: 100 },
  { x: new Date("2024-02-01").getTime(), y: 120 },
  { x: new Date("2024-03-01").getTime(), y: 90 },
  { x: new Date("2024-04-01").getTime(), y: 150 },
];

export default function TimeSeriesChart() {
  return (
    <CartesianChart
      width={400}
      height={250}
      xAxis={{
        scaleType: "time",
        showGrid: true,
        tickCount: 4,
      }}
      yAxis={{
        showGrid: true,
      }}
    >
      <LineChart
        data={timeData}
        lineColor="#8b5cf6"
        strokeWidth={2}
        curve={d3.curveCatmullRom}
        animated={true}
      />
    </CartesianChart>
  );
}
```

## Performance Considerations

### Best Practices

1. **Data Optimization**: Keep data arrays reasonably sized (< 1000 points for smooth performance)
2. **Animation Usage**: Use animations sparingly on lower-end devices
3. **Memoization**: Wrap chart components in `React.memo()` when data doesn't change frequently
4. **Reanimated Worklets**: Chart animations run on the UI thread for optimal performance
5. **List Size Changes**: Varying the data size while animating can cause unexpected results

### Memory Management

```tsx
import React, { useMemo } from "react";
import { CartesianChart, LineChart } from "exchartz";

export default function OptimizedChart({ rawData }) {
  // Memoize processed data to avoid recalculations
  const chartData = useMemo(
    () =>
      rawData.map((item, index) => ({
        x: index,
        y: item.value,
      })),
    [rawData]
  );

  return (
    <CartesianChart width={300} height={200}>
      <LineChart data={chartData} />
    </CartesianChart>
  );
}
```

### Performance Tips

- Use `animated={false}` for static charts
- Limit the number of data points for real-time charts
- Consider data sampling for large datasets
- Use `React.memo()` to prevent unnecessary re-renders
- Avoid frequent prop changes that trigger re-animations

## Troubleshooting

### Common Issues

**Charts not rendering**

- Ensure `react-native-skia` is properly installed and linked
- Check that chart dimensions (`width`, `height`) are provided
- Verify data format matches `ChartDataPoint` interface

**Animations not working**

- Confirm `react-native-reanimated` is installed and configured
- Check that `animated={true}` is set on chart components
- Ensure your React Native version supports Reanimated 3.x

**TypeScript errors**

- Install `@types/d3` for D3 type definitions: `npm install -D @types/d3`
- Ensure your TypeScript version is 4.5 or higher

**Performance issues**

- Reduce data point count for smoother animations
- Disable animations on lower-end devices
- Use `React.memo()` to optimize re-renders

### Platform-Specific Notes

**iOS**

- Ensure iOS deployment target is 11.0 or higher
- Add Skia framework to your iOS project if using bare React Native

**Android**

- Minimum SDK version should be 21 or higher
- Enable Hermes for better performance

**Expo**

- Use Expo SDK 49+ for best compatibility
- Ensure development build includes native dependencies

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Write tests** for new functionality
3. **Follow TypeScript best practices** and maintain type safety
4. **Update documentation** for any API changes
5. **Test on both platforms** (iOS and Android)

### Development Setup

```bash
git clone https://github.com/mzkux/exchartz.git
cd exchartz
npm install
npm run build
npm test
```

### Submitting Changes

1. Create a pull request with a clear description
2. Include examples of new features
3. Ensure all tests pass
4. Update README.md if needed

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/mzkux/exchartz)
- 🐛 [Issue Tracker](https://github.com/mzkux/exchartz/issues)
- 💬 [Discussions](https://github.com/mzkux/exchartz/discussions)

---

Built using React Native Skia and Reanimated
