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

        {
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
        }
          

          {/* <QuranWidget
                // head={content.head}
                // content={content.content}
                // tail={content.tail}
                // head="بسم الله الرحمن الرحيم"
                content="فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا 23"
                translation="So, surely with hardship comes ease."
                // tail="صدق الله العظيم"
                textColor={photo.colors[2]}
                altTextColor={photo.colors[1]}
                backgroundColor={photo.colors[0]}
                aya={12}
                // sura={Math.ceil(Math.random() * 114)}
                sura={s}
                onClick={(e) => e.shiftKey && setS(v => v + 1)}
              /> */}

          {/* {
            content.type === 'quran' && (
              <QuranWidget
                // head={content.head}
                // content={content.content}
                content="فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا 23"
                // tail={content.tail}
                textColor={photo.colors[2]}
                altTextColor={photo.colors[1]}
                backgroundColor={photo.colors[0]}
                aya={12}
                sura={1}
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
