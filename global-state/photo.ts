/**
 * Dependency imports
 */
import { createGlobalState } from 'speedux';

/**
 * Local imports
 */
import dataServices from '../services/data-services';
import localStorageServices from '../services/local-storage-services';

/**
 * Types
 */
export interface State {
  photo: null | Photo,
  favoritePhotos: string[],
}

export interface Actions {
  syncPhotosData: (forceSync?: boolean, forceParams?: Record<string, any>) => Promise<void>,
  loadPhoto: (photoId?: string) => Promise<void>,
  addToFavoritePhotos: (photoId?: string) => Promise<void>,
  removeFromFavoritePhotos: (photoId?: string) => Promise<void>,
  updatePhoto: (path: string, value: any) => void,
}

/**
 * Global state
 */
export default createGlobalState<State, Actions>({
  name: 'photos',

  state: {
    photo: null,
    favoritePhotos: [],
  },

  handlers: {
    '@@INIT': () => ({
      favoritePhotos: localStorageServices.favoritePhotos.get('photos'),
    }),
  },

  actions: {
    syncPhotosData: function* (forceSync = false, forceParams = {}) {
      dataServices.photos.sync(forceSync, forceParams);
    },
    loadPhoto: function* (photoId?) {
      let photoToLoad;

      if (photoId) {
        photoToLoad = yield dataServices.photos.getItemById(photoId);
      } else {
        const cachedPhotos = (yield dataServices.photos.getItems({ where: { cached: 'yes' } })) as Photo[];

        const randomPhoto = (yield dataServices.photos.getRandomItem()) as Photo;
        
        if (randomPhoto) {
          yield dataServices.photos.updateItem(randomPhoto.id, { cached: 'yes' });
          (new Worker('sw.js')).postMessage(['cache-photo', randomPhoto.src]);
        }

        if (cachedPhotos.length > 0) {
          photoToLoad = cachedPhotos[Math.floor(Math.random() * (cachedPhotos.length - 1))];
        } else {
          photoToLoad = randomPhoto;
        }
      }
      
      yield { photo: photoToLoad as Photo };
    },
    addToFavoritePhotos: function* (photoId?) {
      yield (prevState) => {
        const id = photoId ?? prevState.photo?.id;

        localStorageServices.favoritePhotos.set('photos', [
          ...localStorageServices.favoritePhotos.get('photos'),
          id,
        ]);

        if (id) {
          return {
            favoritePhotos: [...prevState.favoritePhotos, id],
          };
        }

        return {};
      };
    },
    removeFromFavoritePhotos: function* (photoId?) {
      yield (prevState) => {
        const id = photoId ?? prevState.photo?.id;

        localStorageServices.favoritePhotos.set('photos', (
          localStorageServices.favoritePhotos.get('photos').filter((v: string) => v !== id)
        ));

        if (id) {
          return {
            favoritePhotos: prevState.favoritePhotos.filter((v: string) => v !== id),
          };
        }

        return {};
      };
    },
    updatePhoto: (path, value) => ({
      [`photo.${path}`]: value,
    }),
  },
});
