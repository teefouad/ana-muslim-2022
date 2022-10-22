/**
 * Dependency imports
 */
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Local imports
 */

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([]).includes(prop.toString()),
})<Partial<SyncingCombinedProps>>((props) => css``);

/**
 * Component(s)
 */

/**
 * Syncing Component
 */
export interface SyncingProps {
  [prop: string]: any,
}

export type SyncingCombinedProps = SyncingProps & JSX.IntrinsicElements['div'];

const Syncing: React.FC<SyncingCombinedProps> = (props) => {
  return (
    <Root>
      Syncing
    </Root>
  );
};

Syncing.defaultProps = {};

export default Syncing;
