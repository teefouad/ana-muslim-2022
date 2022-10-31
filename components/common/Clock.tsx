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
    'periodScale',
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
  periodScale,
  appeared,
  hours,
  minutes,
  alignTransitions,
}) => {
  const periodFontSizeInEm = 0.7;
  const periodWidth = 0.912;
  const periodSpacing = minutes?.slice(-1) === '7' ? -0.05 : 0.2;
  const colonWidth = 0.2;
  const colonSpacing = 0.04;
  const clockWidthInEm = getDigitsSizeInEm(hours!) + getDigitsSizeInEm(minutes!) + (colonWidth + 2 * colonSpacing) + (mode === '12' ? periodScale! * periodWidth + periodSpacing * periodFontSizeInEm : 0); // 0.2 = colon width, 0.5 = period width(45px / 100px), 0.1 = period left margin in em
  const alignmentMultiplier = {
    start: 0,
    center: 0.5,
    end: 1,
  };

  return css`
    position: relative;
    direction: ltr;
    width: ${clockWidthInEm}em;
    height: 1em;
    user-select: none;
    font-weight: 200;
    line-height: 1;
    transition: ${alignTransitions ? `500ms width 100ms ${easing.softSnap}` : null};
    
    .wb-clock__wrapper {
      position: absolute;
      top: 0;
      left: ${alignmentMultiplier[align!] * 100}%;
      margin-left: -${toRem(2)};
      display: block;
      width: ${colonWidth + 2 * colonSpacing}em;
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
      right: calc(100% + ${colonSpacing}em);
    }

    .wb-clock__minutes {
      left: calc(100% + ${colonSpacing}em);
    }

    .wb-clock__colon {
      position: relative;
      top: 10%;
      text-align: center;
      font-size: 1.3em;
      text-indent: -0.035em;
    }

    .wb-clock__period {
      position: absolute;
      top: 52%;
      left: 100%;
      display: inline-block;
      font-size: ${periodFontSizeInEm}em;
      opacity: ${mode === '12' ? 1 : 0};
      transform-origin: 6% 62%;
      transform: translateX(${(getDigitsSizeInEm(minutes!, 100) + periodSpacing) / periodFontSizeInEm}em) scale(${periodScale}); /* divide by periodFontSizeInEm to undo time period font size reduction */
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
  periodScale?: number,
}

const Clock: React.FC<Props & JSX.IntrinsicElements['div']> = ({
  mode,
  strokeWidth,
  ...props
}) => {
  const [appeared, setAppeared] = React.useState(false);
  const time = useCurrentTime();
  const hours = leadZero(mode === '12' ? time.hours : time.hours24);
  const minutes = leadZero(time.minutes);
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
  periodScale: 1,
};

export default Clock;
