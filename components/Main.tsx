/**
 * Dependency imports
 */
import React from 'react';
import styled from '@emotion/styled';

/**
 * Local imports
 */
import QuranWidget from './widgets/QuranWidget';
import HadeethWidget from './widgets/HadeethWidget';
import Background from './Background';
import Layout from './Layout';
import { State as PhotoState } from '../global-state/photo';
import { State as ContentState } from '../global-state/content';
import localStorageServices from '../services/local-storage-services';
import DateTimeWidget from './widgets/DateTimeWidget';
import Digit from './common/Digit';
import Clock from './common/Clock';
import Digits from './common/Digits';

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
  const { photo } = photoState;
  const { content } = contentState;
  const photoIsFavorite = photo && localStorageServices.favoritePhotos.get('photos').includes(photo.id);

  if (!photo || !content) return null;

  return (
    <Root>
      <Layout>
        <Layout.Main>

          {/* <div style={{ display: 'flex', color: '#fff', fontSize: 60 }}>
            <Clock />
          </div> */}
          {/* <div style={{ color: '#fff', fontSize: 100 }}>
            <Digits value="0123456789" />
          </div> */}
          {/* <div style={{ color: '#fff', fontSize: 100 }}>
            <Digit value={0} />
            <Digit value={1} />
            <Digit value={2} />
            <Digit value={3} />
            <Digit value={4} />
            <Digit value={5} />
            <Digit value={6} />
            <Digit value={7} />
            <Digit value={8} />
            <Digit value={9} />
          </div> */}

          <DateTimeWidget
            layout="4"
            lang="ar"
            timeMode="12"
            calendar="hijri"
            textColor={photo.colors[2]}
            altTextColor={photo.colors[1]}
            backgroundColor={photo.colors[0]}
          />

          <h1>Widget Goes Here</h1>

          {/* {
            content.type === 'hadeeth_nabawi' && (
              <HadeethWidget
                head={content.head}
                content={content.content}
                tail={content.tail}
                textColor={photo.colors[2]}
                altTextColor={photo.colors[1]}
                backgroundColor={photo.colors[0]}
              />
            )
          }

          {
            content.type === 'quran' && (
              <QuranWidget
                // head={content.head} // disabled temporarily
                content={content.content}
                // tail={content.tail} // disabled temporarily
                translation={content.translation}
                textColor={photo.colors[2]}
                altTextColor={photo.colors[1]}
                backgroundColor={photo.colors[0]}
                sura={content.source ? +content.source?.split(':')[0] : undefined}
                aya={content.source ? +content.source?.split(':')[1] : undefined}
              />
            )
          } */}

        </Layout.Main>
      </Layout>

      <Background
        lowResURL={photo.preview}
        highResURL={photo.src}
        overlayColor={photo.colors[0]}
        fromPosition={photo.position?.from}
        toPosition={photo.position?.to}
      />
    </Root>
  );
};

Main.defaultProps = {};

export default Main;
