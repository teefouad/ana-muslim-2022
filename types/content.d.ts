declare interface Content {
  id: string;
  active: boolean;
  type:
    | 'quran'
    | 'hadeeth_qudsi'
    | 'hadeeth_nabawi'
    | 'morning_azkar'
    | 'evening_azkar'
    | 'morning_evening_azkar'
    | 'duaa';
  head?: string;
  content: string;
  tail?: string;
  source?: string;
  extra?: {
    description?: string;
    order?: number;
    repeat?: number;
    [key: string]: any;
  };
  version?: number;
}
