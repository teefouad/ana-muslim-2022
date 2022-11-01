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
import { Button, Group } from '@mantine/core';
import Chameleon from './common/Chameleon';
import { getDatePartsFromCalendar } from '../utils/date-time';

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


  const [lang, setLang] = React.useState('ar');
  const [calendar, setCalendar] = React.useState('hijri');
  const [layout, setLayout] = React.useState('1');
  const [mode, setMode] = React.useState('12');
  const [m, setM] = React.useState(1);
  const [d, setD] = React.useState(1);
  
  const _date = getDatePartsFromCalendar(new Date(`${m}-${d}-2022`), calendar, lang);

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
            layout={layout}
            lang={lang}
            timeMode={mode}
            calendar={calendar}
            weekday={_date.weekday}
            month={_date.month}
            textColor={photo.colors[2]}
            altTextColor={photo.colors[1]}
            backgroundColor={photo.colors[0]}
            />

          <div style={{ color: '#fff', fontSize: 100 }}>
            <Chameleon watch={[mode]}>
              <Digits value={mode} outDuration={0} />
            </Chameleon>
          </div>
          

          <div>
            <Group>
              <Button onClick={() => setD(v => v === 31 ? 1 : v + 1)}>Next day</Button>
              <Button onClick={() => setD(v => v === 1 ? 31 : v - 1)}>Prev day</Button>
            </Group>
            <Group>
              <Button onClick={() => setM(v => v === 12 ? 1 : v + 1)}>Next month {m}</Button>
              <Button onClick={() => setM(v => v === 1 ? 12 : v - 1)}>Prev month</Button>
            </Group>
            <Group>
              <Button onClick={() => setLang('ar')}>Ar</Button>
              <Button onClick={() => setLang('en')}>En</Button>
            </Group>
            <Group>
              <Button onClick={() => setCalendar('hijri')}>Hijri</Button>
              <Button onClick={() => setCalendar('gregorian')}>Gregorian</Button>
            </Group>
            <Group>
              <Button onClick={() => setMode('12')}>Mode 12</Button>
              <Button onClick={() => setMode('24')}>Mode 24</Button>
            </Group>
            <Group>
              <Button onClick={() => setLayout('1')}>Layout 1</Button>
              <Button onClick={() => setLayout('2')}>Layout 2</Button>
              <Button onClick={() => setLayout('3')}>Layout 3</Button>
              <Button onClick={() => setLayout('4')}>Layout 4</Button>
            </Group>
          </div>

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
