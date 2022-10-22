/**
 * Dependency imports
 */
import * as React from 'react';
import type { NextPage } from 'next';

/**
 * Local imports
 */
import Main from '../components/Main';
import Syncing from '../components/Syncing';
import contentStateManager from '../global-state/content';
import photoStateManager from '../global-state/photo';
import dataServices from '../services/data-services';

/**
 * Home Component
 */
const Home: NextPage = () => {
  const [readyToRender, setReadyToRender] = React.useState(true);

  const contentState = contentStateManager.useState();
  const contentActions = contentStateManager.useActions();

  const photoState = photoStateManager.useState();
  const photoActions = photoStateManager.useActions();

  const checkIfReadyToRender = async () => {
    const syncedContent = await dataServices.content.getItems();
    const syncedPhotos = await dataServices.photos.getItems();

    if (syncedContent.length && syncedPhotos.length) {
      contentActions.loadContent();
      photoActions.loadPhoto();
      setReadyToRender(true);
    } else {
      setReadyToRender(false);
      setTimeout(checkIfReadyToRender, 1000);
    }
  };

  React.useEffect(() => {
    contentActions.syncContentData();
    photoActions.syncPhotosData();
    checkIfReadyToRender();
  }, []);

  if (!readyToRender) return (
    <Syncing />
  );

  return (
    <Main
      contentState={contentState}
      photoState={photoState}
    />
  )
}

export default Home;
