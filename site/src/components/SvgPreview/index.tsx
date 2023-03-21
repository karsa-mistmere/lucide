import React from 'react';
import { PathProps, Path } from './types';
import { getPaths, assert } from './utils';

const Grid = ({
  radius,
  fill,
  ...props
}: {
  strokeWidth: number;
  radius: number;
} & PathProps<'stroke', 'strokeWidth'>) => (
  <g className="svg-preview-grid-group" strokeLinecap="butt" {...props}>
    <rect
      width={24 - props.strokeWidth}
      height={24 - props.strokeWidth}
      x={props.strokeWidth / 2}
      y={props.strokeWidth / 2}
      rx={radius}
      fill={fill}
    />
    <path
      d={
        props.d ||
        new Array(Math.floor(24 - 1))
          .fill(null)
          .flatMap((_, i) => [
            `M${props.strokeWidth} ${i + 1}h${24 - props.strokeWidth * 2}`,
            `M${i + 1} ${props.strokeWidth}v${24 - props.strokeWidth * 2}`,
          ])
          .join('')
      }
    />
  </g>
);

const Shadow = ({
  radius,
  paths,
  ...props
}: {
  radius: number;
  paths: Path[];
} & PathProps<'stroke' | 'strokeWidth' | 'strokeOpacity', 'd'>) => (
  <>
    <mask
      id="svg-preview-shadow-mask"
      maskUnits="userSpaceOnUse"
      strokeOpacity="1"
      strokeWidth={props.strokeWidth}
      stroke="#000"
    >
      <rect x={0} y={0} width={24} height={24} fill="#fff" stroke="none" rx={radius} />
      <path
        d={paths
          .flatMap(({ prev, next }) => [`M${prev.x} ${prev.y}h.01`, `M${next.x} ${next.y}h.01`])
          .filter((val, idx, arr) => arr.indexOf(val) === idx)
          .join('')}
      />
    </mask>
    <g className="svg-preview-shadow-group" {...props}>
      {paths.map(({ d }, i) => (
        <path key={i} mask="url(#svg-preview-shadow-mask)" d={d} />
      ))}
      <path
        d={paths
          .flatMap(({ prev, next }) => [`M${prev.x} ${prev.y}h.01`, `M${next.x} ${next.y}h.01`])
          .filter((val, idx, arr) => arr.indexOf(val) === idx)
          .join('')}
      />
    </g>
  </>
);

const ColoredPath = ({
  colors,
  paths,
  ...props
}: { paths: Path[]; colors: string[] } & PathProps<never, 'd' | 'stroke'>) => (
  <g className="svg-preview-colored-path-group" {...props}>
    {paths.map(({ d, c }, i) => (
      <path key={i} d={d} stroke={colors[(c.name === 'path' ? i : c.id) % colors.length]} />
    ))}
  </g>
);

const ControlPath = ({
  paths,
  radius,
  pointSize,
  ...props
}: { pointSize: number; paths: Path[]; radius: number } & PathProps<
  'stroke' | 'strokeWidth',
  'd'
>) => {
  const controlPaths = paths.map((path, i) => {
    const element = paths.filter((p) => p.c.id === path.c.id);
    const lastElement = element.at(-1)?.next;
    assert(lastElement);
    const isClosed = element[0].prev.x === lastElement.x && element[0].prev.y === lastElement.y;
    const showMarker = !['rect', 'circle', 'ellipse'].includes(path.c.name);
    return {
      ...path,
      showMarker,
      startMarker: showMarker && path.isStart && !isClosed,
      endMarker: showMarker && paths[i + 1]?.isStart !== false && !isClosed,
    };
  });
  return (
    <>
      <g
        className="svg-preview-control-path-marker-mask-group"
        strokeWidth={pointSize}
        stroke="#000"
      >
        {controlPaths.map(({ prev, next, showMarker }, i) => {
          return (
            showMarker && (
              <mask
                id={`svg-preview-control-path-marker-mask-${i}`}
                key={i}
                maskUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="24" height="24" fill="#fff" stroke="none" rx={radius} />
                <path d={`M${prev.x} ${prev.y}h.01`} />
                <path d={`M${next.x} ${next.y}h.01`} />
              </mask>
            )
          );
        })}
      </g>
      <g className="svg-preview-control-path-group" {...props}>
        {controlPaths.map(({ d, showMarker }, i) => (
          <path
            key={i}
            mask={showMarker ? `url(#svg-preview-control-path-marker-mask-${i})` : undefined}
            d={d}
          />
        ))}
      </g>
      <g className="svg-preview-control-path-marker-group" {...props}>
        <path
          d={controlPaths
            .flatMap(({ prev, next, showMarker }) =>
              showMarker ? [`M${prev.x} ${prev.y}h.01`, `M${next.x} ${next.y}h.01`] : []
            )
            .join('')}
        />
        {controlPaths.map(({ d, prev, next, startMarker, endMarker }, i) => (
          <React.Fragment key={i}>
            {startMarker && <circle cx={prev.x} cy={prev.y} r={pointSize / 2} />}
            {endMarker && <circle cx={next.x} cy={next.y} r={pointSize / 2} />}
          </React.Fragment>
        ))}
      </g>
    </>
  );
};

const SvgPreview = React.forwardRef<
  SVGSVGElement,
  { src: string; showGrid?: boolean; darkMode?: boolean }
>(({ src, showGrid = false, darkMode = false }, ref) => {
  const paths = getPaths(src);
  const shadowColor = darkMode ? '#fff' : '#777';
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {showGrid && <Grid strokeWidth={0.1} stroke={shadowColor} strokeOpacity={0.3} radius={1} />}
      <Shadow paths={paths} strokeWidth={4} stroke={shadowColor} radius={1} strokeOpacity={0.15} />
      <ColoredPath
        paths={paths}
        colors={[
          '#1982c4',
          '#4267AC',
          '#6a4c93',
          '#B55379',
          '#FF595E',
          '#FF7655',
          '#ff924c',
          '#FFAE43',
          '#ffca3a',
          '#C5CA30',
          '#8ac926',
          '#52A675',
        ]}
      />
      <ControlPath radius={1} paths={paths} pointSize={1} stroke="#fff" strokeWidth={0.125} />
    </svg>
  );
});

export default SvgPreview;
