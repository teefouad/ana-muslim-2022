/**
 * Dependency imports
 */
import React from 'react';
import classnames from 'classnames';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Local imports
 */
import Digits, { getDigitsSizeInEm } from './Digits';
import { useCurrentTime } from '../../hooks/use-current-time';
import { useWatchTower } from '../../hooks/use-watch-tower';
import { leadZero } from '../../utils/numbers';
import { toRem } from '../../utils/text';
import * as easing from '../../utils/easing';

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'mode',
    'align',
    'periodSize',
    'appeared',
    'hours',
    'minutes',
    'period',
    'alignTransitions',
  ]).includes(prop.toString()),
})<Partial<Props & {
  appeared: boolean,
  hours: string,
  minutes: string,
  period: string,
  alignTransitions: boolean,
}>>(({
  mode,
  align,
  periodSize,
  appeared,
  hours,
  minutes,
  alignTransitions,
}) => {
  const periodWidth = 0.5;
  const periodSpacing = minutes?.slice(-1) === '7' ? -0.05 : 0.1;
  const clockWidthInEm = getDigitsSizeInEm(hours!) + getDigitsSizeInEm(minutes!) + 0.2 + (mode === '12' ? periodSize! * periodWidth + periodSpacing * 0.357 : 0); // 0.2 = colon width, 0.5 = period width(45px / 100px), 0.1 = period left margin in em
  const alignmentMultiplier = {
    start: 0,
    center: 0.5,
    end: 1,
  };

  return css`
    position: relative;
    user-select: none;
    direction: ltr;
    width: ${clockWidthInEm}em;
    height: 1em;
    font-size: ${toRem(100)};
    font-weight: 200;
    transition: ${alignTransitions ? `500ms width 100ms ${easing.softSnap}` : null};

    .wb-clock__wrapper {
      position: absolute;
      top: 0;
      left: ${alignmentMultiplier[align!] * 100}%;
      margin-left: -${toRem(2)};
      display: block;
      width: 0.2em;
      height: 100%;
      transform: translateX(${getDigitsSizeInEm(hours!) - alignmentMultiplier[align!] * clockWidthInEm}em);
      transition: ${alignTransitions ? `500ms transform 100ms ${easing.softSnap}` : null};
    }

    .wb-clock__hours,
    .wb-clock__minutes {
      position: absolute;
      top: 0;
    }

    .wb-clock__hours {
      right: 100%;
    }

    .wb-clock__colon {
      position: relative;
      top: -10%;
      text-align: center;
      text-indent: -0.035em;
    }

    .wb-clock__minutes {
      left: 100%;
    }

    .wb-clock__period {
      position: absolute;
      top: 58%;
      left: 100%;
      display: inline-block;
      font-size: 0.357em;
      transform-origin: 6% 62%;
      transform: translateX(${(getDigitsSizeInEm(minutes!, 100) + periodSpacing) / 0.357}em) scale(${periodSize}); /* divide by 0.357 to undo time period font size reduction */
      animation-name: ${mode === '12' ? 'clock-time-period-appear' : 'clock-time-period-disappear'};
      animation-duration: ${mode === '12' ? '400ms' : '200ms'};
      animation-timing-function: ease-out;
      animation-delay: ${appeared ? (mode === '12' ? '400ms' : '0') : '1000ms'};
      animation-fill-mode: both;
      transition:
        500ms opacity ${easing.softSnap},
        500ms transform 100ms ${easing.softSnap};

      @keyframes clock-time-period-appear {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes clock-time-period-disappear {
        to { opacity: 0; }
      }
    }
  `;
});

/**
 * Clock Component
 */
interface Props {
  mode?: '12' | '24',
  strokeWidth?: number,
  align?: 'start' | 'center' | 'end',
  periodSize?: number,
}

const Clock: React.FC<Props & JSX.IntrinsicElements['div']> = ({
  mode,
  strokeWidth,
  ...props
}) => {
  const [appeared, setAppeared] = React.useState(false);
  const time = useCurrentTime();
  const hours = leadZero(mode === '12' ? time.hours : time.hours24);
  // const minutes = leadZero(time.minutes);
  const [s, setS] = React.useState(0);
  const minutes = leadZero(s);
  const alignValueWasJustUpdated = useWatchTower(props.align);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setAppeared(true);
    }, 1400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Root
      {...props}
      className={classnames('wb-clock', props.className)}
      mode={mode}
      hours={hours}
      minutes={minutes}
      appeared={appeared}
      period={time.period}
      alignTransitions={!alignValueWasJustUpdated}
      onClick={() => setS(v => v === 59 ? 0 : v + 1)}
    >
      <div className="wb-clock__wrapper">
        <div className="wb-clock__hours">
          <Digits
            stagger={350}
            value={hours}
            strokeWidth={strokeWidth}
          />
        </div>

        <div className="wb-clock__colon">
          :
        </div>

        <div className="wb-clock__minutes">
          <Digits
            stagger={350}
            value={minutes}
            strokeWidth={strokeWidth}
          />
        </div>

        <div className="wb-clock__period">
          {time.period}
        </div>
      </div>
    </Root>
  );
};

Clock.defaultProps = {
  mode: '12',
  strokeWidth: 7,
  align: 'end',
  periodSize: 1,
};

export default Clock;
