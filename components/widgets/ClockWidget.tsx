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
import Clock, { Props as ClockProps } from '../common/Clock';
import { toRem } from '../../utils/text';

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'textColor',
  ]).includes(prop.toString()),
})<Partial<ClockWidgetCombinedProps>>(({
  textColor,
}) => css`
  font-size: ${toRem(60)};
  color: ${textColor};
`);

/**
 * ClockWidget Component
 */
export interface ClockWidgetProps {
  textColor?: string,
}

export type ClockWidgetCombinedProps = ClockWidgetProps & ClockProps & JSX.IntrinsicElements['div'];

const ClockWidget: React.FC<ClockWidgetCombinedProps> = ({
  mode,
  strokeWidth,
  align,
  periodScale,
  ...props
}) => {
  const [clockMode, setClockMode] = React.useState<'12' | '24'>(mode!);

  const toggleClockMode = () => {
    setClockMode(v => v === '12' ? '24' : '12');
  };
  
  return (
    <Root
      {...props}
      onClick={toggleClockMode}
      className={classnames('wb-clock-widget', props.className)}
    >
      <Clock
        mode={clockMode}
        strokeWidth={strokeWidth}
        align={align}
        periodScale={periodScale}
      />
    </Root>
  );
};

ClockWidget.defaultProps = {
  textColor: '#fff',
  mode: '12',
};

export default ClockWidget;
