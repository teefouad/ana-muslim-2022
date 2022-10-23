/**
 * Dependency imports
 */
import React from 'react';
import styled from '@emotion/styled';

/**
 * Local imports
 */

/**
 * Root
 */
const Root = styled.div``;

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
