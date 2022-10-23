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
import Text, { Props as TextProps } from './Text';
import { removeDiacritics } from '../../utils/text';

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'inline',
  ]).includes(prop.toString()),
})<Partial<Props & {
  inline: boolean,
}>>((props) => css`
  position: relative;
  display: ${props.inline ? 'inline-block' : 'block'};

  > .wb-no-diacritics {
    position: relative;
    z-index: 1;
    pointer-events: none;
    user-select: none;
  }

  > .wb-diacritics {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
    pointer-events: initial;
  }
`);

/**
 * StackedDiacritics Component
 */
export interface Props {
  text: string,
}

const StackedDiacritics: React.FC<Props & TextProps & JSX.IntrinsicElements['div']> = ({
  text,
  type,
  offset,
  inline,
  ...props
}) => {
  return (
    <Root {...props} inline={inline} className={classnames('wb-stacked-diacritics', props.className)}>
      <div className="wb-diacritics">
        <Text type={type} offset={offset} inline={inline}>
          {text}
        </Text>
      </div>

      <div className="wb-no-diacritics">
        <Text type={type} offset={offset} inline={inline}>
          {removeDiacritics(text)}
        </Text>
      </div>
    </Root>
  );
};

StackedDiacritics.defaultProps = {
  ...Text.defaultProps,
};

export default StackedDiacritics;
