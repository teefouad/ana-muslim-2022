/**
 * Dependency imports
 */
import React from 'react';
import styled from '@emotion/styled';
import classnames from 'classnames';

/**
 * Local imports
 */
import Digit, { getDigitSizeInEm } from './Digit';

/**
 * Constants
 */
export const getDigitsSizeInEm = (value: string, baseFontSize?: number) => Array.from(value).reduce((p, n) => p + getDigitSizeInEm(+n, baseFontSize), 0);

/**
 * Root
 */
const Root = styled.div`
  display: inline-flex;
  direction: ltr;
`;

/**
 * Digits Component
 */
interface Props {
  value: string,
  stagger?: number,
  strokeWidth?: number,
  inDuration?: number,
  inDelay?: number,
  outDuration?: number,
  outDelay?: number,
}

const Digits: React.FC<Props & JSX.IntrinsicElements['div']> = ({
  value,
  stagger,
  strokeWidth,
  inDuration,
  inDelay,
  outDuration,
  outDelay,
  ...props
}) => {
  return (
    <Root {...props} className={classnames('wb-digits', props.className)}>
      {
        Array.from(value).map((part, n) => (
          <Digit
            key={n}
            value={+part}
            watch={[value]}
            inDuration={inDuration}
            inDelay={inDelay! + (n * stagger!)}
            outDuration={outDuration}
            outDelay={outDelay!}
            strokeWidth={strokeWidth}
          />
        ))
      }
    </Root>
  );
};

Digits.defaultProps = {
  stagger: 200,
  inDuration: 600,
  inDelay: 200,
  outDuration: 200,
  outDelay: 0,
};

export default Digits;
