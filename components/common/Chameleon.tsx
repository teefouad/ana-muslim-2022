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
import { useChameleon } from '../../hooks/use-chameleon';

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'inline',
  ]).includes(prop.toString()),
})<Partial<Props & {
  inline: boolean,
}>>(({
  inline,
}) => css`
  display: ${inline ? 'inline-block' : 'block'};
`);

/**
 * Component(s)
 */
const Wrapper = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'visible',
    'duration',
  ]).includes(prop.toString()),
})<{
  visible: boolean,
  duration: number,
}>(({
  visible,
  duration,
}) => css`
  display: inline-block;
  opacity: ${visible ? 1 : 0};
  transition: opacity ${duration}ms;
`);

/**
 * Chameleon Component
 */
interface Props {
  watch: any[],
  duration?: number,
  delay?: number,
  inline?: boolean,
  wrapperProps?: any,
}

const Chameleon: React.FC<Props & JSX.IntrinsicElements['div']> = ({
  watch,
  duration,
  delay,
  wrapperProps,
  children,
  ...props
}) => {
  const [content, visible] = useChameleon(children, watch, {
    duration,
    delay,
  });
  
  return (
    <Root {...props} className={classnames('wb-chameleon', props.className)}>
      <Wrapper
        {...wrapperProps}
        visible={visible}
        duration={duration!}
        className="wb-chameleon__wrapper"
      >
        {content}
      </Wrapper>
    </Root>
  );
};

Chameleon.defaultProps = {
  watch: [],
  duration: 200,
  delay: 0,
  inline: false,
  wrapperProps: {},
};

export default Chameleon;
