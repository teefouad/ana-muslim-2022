/**
 * Dependency imports
 */
import Dexie from 'dexie';

/**
 * Database class
 */
class Database<T> extends Dexie {
  data: Dexie.Table<T, number>;

  constructor(name: string, fields: string[], version: number = 1) {
    super(name);
    this.version(version).stores({ data: fields.join(',') });
    this.data = this.table('data');
  }
}

/**
 * DataService class
 */
class DataService<T extends { id: string }> {
  protected identifier: string;

  protected syncURL: string;

  protected syncIntervalInHours: number = 8;

  protected defaultValue: T[] | undefined;

  protected itemMapper: (item: T) => T | undefined;

  protected db: Database<string>;

  protected data: Dexie.Table<string, number>;
  
  constructor({
    identifier,
    syncURL,
    syncIntervalInHours,
    defaultValue,
    indexedFields = [],
    itemMapper = item => item,
  }: {
    identifier: string;
    syncURL: string;
    syncIntervalInHours?: number;
    defaultValue?: T[];
    indexedFields?: string[];
    itemMapper?: (item: T) => T;
  }) {
    this.db = new Database(identifier, ['++id', ...indexedFields]);
    this.data = this.db.data;
    this.identifier = identifier;
    this.syncURL = syncURL;
    this.itemMapper = itemMapper;
    if (syncIntervalInHours) this.syncIntervalInHours = syncIntervalInHours;
    if (defaultValue) this.defaultValue = defaultValue;
  }

  async getRandomItem() {
    const count = await this.getItemsCount();
    const randomIndex = Math.floor(Math.random() * (count - 1));
    const randomItem = await this.getItemByIndex(randomIndex);
    return randomItem;
  }

  async getItemByIndex(index: number) {
    return await this.data.offset(index).limit(1).first();
  }

  async getItemById(id: string) {
    return await this.data.get({ id });
  }

  async getItems({
    offset = 0,
    limit = -1,
    where = undefined,
  }: {
    offset?: number,
    limit?: number,
    where?: Record<string, any>,
  } = {}) {
    let data: any = this.data;

    if (where) {
      data = data.where(where);
    }
    
    data = data.offset(offset);

    if (limit >= 0) data = data.limit(limit);

    return data.toArray();
  }

  async getItemsCount() {
    return await this.data.count();
  }

  async updateItem(id: string, data: any) {
    return await this.data.update(id, data);
  }

  async sync(forceSync: boolean = false, forceParams: Record<string, any> = {}) {
    if (!forceSync && !this.shouldSync()) return;

    const info = this.getInfo();
    const url = `${this.syncURL}`;
    const params = {
      min_version: info.version ?? 1,
      page: info.page ?? 0,
      limit: 50,
      ...forceParams,
    };
    const queryString = Object.entries(params).reduce((p: string[], n) => ([...p, `${n[0]}=${n[1]}`]), []).join('&');
    const response = await fetch(`${url}?${queryString}`).catch(() => new Error());

    if (!(response instanceof Error) && response.status === 200) {
      const data = await response.json();
      await this.data.bulkPut(data.added.map((item: T) => this.itemMapper(item)));
      await this.data.where('id').anyOf(data.removed).delete();

      if (data.page + 1 > data.max_page) {
        this.setInfo({ page: 0, version: data.version + 1 });
      } else {
        const currentInfo = this.getInfo();
        this.setInfo({ page: data.page + 1, version: currentInfo.version ?? 1 });
      }
    }
  }

  shouldSync() {
    const info = this.getInfo();
    const syncIntervalInMilliSeconds = this.syncIntervalInHours * 60 * 60 * 1000;

    return (
      !info
      || !info.lastUpdated
      || Date.now() - info.lastUpdated > syncIntervalInMilliSeconds
    );
  }

  getInfo() {
    const key = this.getInfoKey();
    return JSON.parse(localStorage.getItem(key) ?? '{}');
  }

  setInfo(value: any) {
    const key = this.getInfoKey();
    localStorage.setItem(key, JSON.stringify({
      ...value,
      lastUpdated: Date.now(),
    }));
  }

  getInfoKey() {
    return `${this.identifier}-info`;
  }

  async clear() {
    localStorage.removeItem(this.getInfoKey());
    return await this.data.clear();
  }
}

/**
 * Default export
 */
const dataServices = {
  photos: new DataService<Photo>({
    identifier: 'ana-muslim-photos',
    syncURL: `${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/sync_photos`,
    syncIntervalInHours: 1 / 60,
    indexedFields: ['cached'],
    itemMapper: photo => ({ ...photo, cached: false }),
  }),
  content: new DataService<Content>({
    identifier: 'ana-muslim-content',
    syncURL: `${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/sync_content`,
    syncIntervalInHours: 1 / 60,
  }),
}

export default dataServices;
