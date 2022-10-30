/**
 * Dependency imports
 */
import React from 'react';
import classnames from 'classnames';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { toRem } from '../../utils/text';

/**
 * Constants
 */
export const DIGIT_SIZES = [
  46, // 0
  30, // 1
  40, // 2
  39, // 3
  51, // 4
  41, // 5
  41, // 6
  36, // 7
  38, // 8
  40, // 9
]; // width based on font-size = 100px

export const DIGIT_CONTAINER_PADDING = 1;

export const getDigitSize = (value: number) => (DIGIT_SIZES[value] + 2 * DIGIT_CONTAINER_PADDING);
export const getDigitSizeInEm = (value: number, baseFontSize: number = 100) => getDigitSize(value) / baseFontSize;

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'inDuration',
    'outDuration',
  ]).includes(prop.toString()),
})<{
  inDuration: number,
  outDuration: number,
}>(({
  inDuration,
  outDuration,
}) => css`
  position: relative;
  display: inline-block;
  font-family: AnaMuslim-Tajawal;
  font-weight: 200;
  line-height: 1;

  > div {
    height: 0.65em;
    opacity: 0;
  }

  > svg {
    position: absolute;

    &[data-digit="1"] {
      margin-left: -0.05em;
    }

    &[data-direction="in"] {
      animation-duration: ${inDuration}ms;
      animation-timing-function: ease-in-out;
      animation-fill-mode: both;
      animation-play-state: paused;

      &[data-state="running"] { animation-play-state: running; }
    }

    &[data-direction="out"] {
      animation-duration: ${outDuration}ms;
      animation-timing-function: ease-in;
      animation-fill-mode: both;
      animation-play-state: paused;

      &[data-state="running"] { animation-play-state: running; }
    }
  }

  ${
    [
      // [digit length, direction]
      [700, -1],
      [340, -1],
      [570, -1],
      [650, 1],
      [710, 1],
      [625, -1],
      [750, -1],
      [415, -1],
      [820, -1],
      [730, 1],
    ].map(([length, dir], n) => css`
      &[data-digit="${n}"] {
        > div {
          width: ${getDigitSizeInEm(n)}em;
        }

        > svg {
          stroke-dasharray: ${length};
        
          &[data-direction="in"] {
            animation-name: digit-appear-${n};

            @keyframes digit-appear-${n} {
              from { stroke-dashoffset: ${-dir * length}; }
              to { stroke-dashoffset: 0; }
            }
          }
          
          &[data-direction="between"] {
            stroke-dashoffset: ${-dir * length};
          }

          &[data-direction="out"] {
            animation-name: digit-disappear-${n};

            @keyframes digit-disappear-${n} {
              to { opacity: 0 }
            }
          }
        }
      }
    `)
  }
`);

/**
 * Component(s)
 */
const SVGDigit: React.FC<{
  value: number,
  strokeWidth: number,
}> = ({
  value,
  strokeWidth,
  ...props
}) => {
  const padding = 8; // prevents svg clipping from the sides

  const dimensions = [
    [172, 263],
    [66, 263],
    [149, 263],
    [146, 263],
    [195, 263],
    [152, 263],
    [152, 263],
    [130, 263],
    [142, 263],
    [147, 263],
  ];

  const paths = [
    "M 85 0.075 Q 49.4220703125 0.9314453125 26.4 33.25 13.3 51.8 6.7 76.6 0.05 101.2 0.05 132.05 0.05 159.8 5.1 182.25 10 204.95 20.15 222.1 42.68359375 262.0349609375 85 262.925 85.969921875 262.95 86.95 262.95 123.65 262.95 146.55 231.3 171.7 195.75 171.7 132.05 171.7 105.5 166.65 83.25 161.75 60.8 151.6 42.8 128.55 0.779296875 88.35 0.075 87.6529296875 0.05 86.95 0.05 85.9703125 0.05 85.35 -0.075",
    "M 0.05 36.4 L 66.45 0.05 66.45 262.95",
    "M 14.45 20.65 Q 50.2 0.05 76.45 0.05 L 76.85 0.05 Q 106.05 0.05 123.3 16.85 131.9 25.05 136.3 36.6 140.7 47.95 140.95 62.45 L 140.95 65.85 Q 140.95 88.75 132.3 104.05 123.7 119.6 89.9 156.6 L 0.05 262.95 149.1 262.95",
    "M 0 241.3 Q 30.05 263.2 61.7 263.2 L 65.6 263.2 Q 82 262.8 95.7 258.3 109.35 253.6 120.5 244.8 132.8 234.65 139.05 221.2 145.3 207.9 145.3 189.9 145.3 189.7 145.3 189.5 145.297265625 189.3998046875 145.3 189.3 145.294140625 189.10234375 145.3 188.9 144.862890625 176.414453125 141.2 166.5 137.5 155.75 130.25 148.15 115.65 132.55 82.95 123.1 L 32.35 122.5 82.8 122.1 Q 82.85 122.1 82.95 122.1 134 106.05 134 62.55 L 134 61.2 Q 133.8 49.25 129.5 39.1 125.2 29.15 116.8 20.95 97.25 2 65.25 2 L 64.05 2 Q 32.4 2 2.9 22.1",
    "M 144.8 262.95 L 144.8 0.05 0.05 201.1 194.6 201.1",
    "M 132.45 0.05 L 12.95 0.05 12.95 109.4 Q 46.15 95.05 64.8 95.05 106.35 95.05 130.2 121.15 140.8 132.3 145.8 146.7 151.1 161.05 151.1 178.7 151.1 180.1 150.7 181.7 150.25 200.8 143.8 216 137.3 230.95 124.95 242.25 102.85 261.7 69.7 262.55 L 65.25 262.95 Q 32.4 262.95 0 241.9",
    "M 140.9 17.35 Q 117.25 0.55 89.35 0.55 71.35 1.3 56.15 10.3 41.1 19.3 29 36.5 0.95 76.008984375 0.55 142.4 0.75 166.05 5.15 185.9 9.85 207.2 19.25 224.2 30.35 243.7 45.2 253.45 60.05 263.45 79 263.45 93.25 263.45 105.55 257.95 117.65 252.7 127.6 242.15 139.15 230.05 144.8 214 150.5 198 150.5 176.5 150.5 141.75 134.05 120.05 124.5 107.55 111.2 101.15 97.95 94.7 80.95 94.5 64.35 94.5 47.35 103.3 30.55 112.05 3.3 140.45",
    "M 0 0.05 L 129 0.05 16.8 262.95",
    "M 68.3 119.1 Q 37 107.25 20.95 91.2 4.9 75.15 4.9 55.2 L 4.9 54.4 Q 4.9 31.5 23.75 16.1 33.15 8.15 44.5 4.35 55.85 0.25 69.3 0.05 82.6 0.05 93.5 3.9 104.6 7.75 113.4 15.7 131.15 31.05 131.6 55.65 131.6 76.65 117.25 91.45 109.95 99 98.25 106.25 84.55 114.85 68.9 119.2 32.95 130.1 16.7 147 0.4 163.9 0 190.25 L 0 191.05 Q 0 221.25 23.75 243.45 34 253.1 45.75 258.05 57.55 262.95 70.6 262.95 85.8 262.95 98.85 256.8 111.9 250.75 122.85 238.75 132.2 228.5 136.9 216.75 141.6 204.95 141.6 191.95 141.6 191.05 141.2 190.25 139.95 139.75 69.05 119.45",
    "M 9.95 245.15 Q 21.45 254.15 34.15 258.45 47.65 263.3 64.45 262.95 81.55 262.65 96.1 253.75 110.35 245.15 121.1 228.75 145.15 192.9 146.25 124.45 146.25 70.95 129.45 38.5 109.55 0.05 71.45 0.05 44.7 0.05 24 21.7 0 46.9 0 85.2 0 104.15 5.25 119.2 10.55 134.2 21.1 145.75 31.6 156.7 43.95 162.15 56.65 167.7 73.2 168 103.9 168 141.95 129.25",
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      preserveAspectRatio="none"
      x="0px"
      y="0px"
      viewBox={`-${padding} -${padding} ${dimensions[value][0] + (2 * padding)} ${dimensions[value][1] + (2 * padding)}`}
      style={{
        top: 0,
        left: '50%',
        height: '100%',
        transform: 'translateX(-50%)',
      }}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
        strokeLinecap="square"
        fill="none"
        d={paths[value]}
      />
    </svg>
  );
};

/**
 * Digit Component
 */
interface Props {
  value: number,
  watch?: any[],
  strokeWidth?: number,
  inDuration?: number,
  inDelay?: number,
  outDuration?: number,
  outDelay?: number,
}

const Digit: React.FC<Props & JSX.IntrinsicElements['div']> = ({
  value,
  watch,
  strokeWidth,
  inDuration,
  inDelay,
  outDuration,
  outDelay,
  ...props
}) => {
  const rendersCount = React.useRef(0);
  const [currentValue, setCurrentValue] = React.useState(value);
  const [direction, setDirection] = React.useState('in');
  const [playState, setPlayState] = React.useState('paused');

  const watchAsString = JSON.stringify(watch);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // initialize on first render, go straigh to 'in' state
    if (rendersCount.current === 0) {
      timeout = setTimeout(() => {
        setDirection('in');
        setPlayState('running');

        timeout = setTimeout(() => {
          setDirection('');
        }, inDuration);
      }, inDelay);
    }

    // the second render is skipped, because of React 18 strict mode
    if (rendersCount.current < 2) {
      rendersCount.current += 1;
      return;
    }

    // for later changes, the cycle would be 'out->between->in'
    timeout = setTimeout(() => {
      setDirection('out');
      setPlayState('running');

      timeout = setTimeout(() => {
        setCurrentValue(value);
        setDirection('between');
        setPlayState('paused');

        timeout = setTimeout(() => {
          setDirection('in');
          setPlayState('running');

          timeout = setTimeout(() => {
            setDirection('');
            setPlayState('paused');
          }, inDuration);
        }, inDelay);
      }, outDuration);
    }, outDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, inDuration, inDelay, outDuration, outDelay, watchAsString]);
  
  return (
    <Root
      inDuration={inDuration!}
      outDuration={outDuration!}
      {...props}
      data-digit={currentValue}
      className={classnames('wb-digit', props.className)}
    >
      <div>
        {currentValue}
      </div>

      <SVGDigit
        value={currentValue}
        data-direction={direction}
        data-state={playState}
        strokeWidth={strokeWidth!}
      />
    </Root>
  );
};

Digit.defaultProps = {
  watch: [],
  strokeWidth: 7,
  inDuration: 600,
  inDelay: 200,
  outDuration: 200,
  outDelay: 0,
};

export default Digit;
