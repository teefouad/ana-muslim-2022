/**
 * Dependency imports
 */
import { createGlobalState } from 'speedux';

/**
 * Local imports
 */
import dataServices from '../services/data-services';

/**
 * Types
 */
export interface State {
  content: null | Content,
}

export interface Actions {
  syncContentData: (forceSync?: boolean, forceParams?: Record<string, any>) => Promise<void>,
  loadContent: (itemId?: string) => Promise<void>,
  updateContent: (path: string, value: any) => void,
}

/**
 * Global state
 */
export default createGlobalState<State, Actions>({
  name: 'content',

  state: {
    content: null,
  },

  actions: {
    syncContentData: function* (forceSync = false, forceParams = {}) {
      dataServices.content.sync(forceSync, forceParams);
    },
    loadContent: function* (itemId?) {
      let itemToLoad;

      if (itemId) {
        itemToLoad = yield dataServices.content.getItemById(itemId);
      } else {
        itemToLoad = (yield dataServices.content.getRandomItem()) as Content;
      }
      
      yield { content: itemToLoad as Content };
    },
    updateContent: (path, value) => ({
      [`content.${path}`]: value,
    }),
  },
});
