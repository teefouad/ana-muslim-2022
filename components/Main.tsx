/**
 * Dependency imports
 */
import React from 'react';
import styled from '@emotion/styled';

/**
 * Local imports
 */
import { State as PhotoState } from '../global-state/photo';
import { State as ContentState } from '../global-state/content';
import localStorageServices from '../services/local-storage-services';
import Layout from './Layout';

/**
 * Root
 */
const Root = styled.main``;

/**
 * Main Component
 */
export interface MainProps {
  photoState: PhotoState,
  contentState: ContentState,
}

export type MainCombinedProps = MainProps & JSX.IntrinsicElements['main'];

const Main: React.FC<MainCombinedProps> = ({
  photoState,
  contentState,
}) => {
  const photoIsFavorite = photoState.photo && localStorageServices.favoritePhotos.get('photos').includes(photoState.photo.id);

  return (
    <Root>
      <Layout>
        <Layout.Main>
          Main Content
        </Layout.Main>
      </Layout>
    </Root>
  );
};

Main.defaultProps = {};

export default Main;
