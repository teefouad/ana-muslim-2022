type PhotoPosition =
  | 'top_right'
  | 'top'
  | 'top_left'
  | 'center_right'
  | 'center'
  | 'center_left'
  | 'bottom_right'
  | 'bottom'
  | 'bottom_left';
  
declare interface Photo {
  id: string;
  cached?: boolean;
  active: boolean;
  likes?: number;
  position?: {
    from: PhotoPosition,
    to: PhotoPosition,
  };
  author?: {
    name?: {
      ar: string;
      en: string;
    };
    url?: string;
  };
  colors: string[];
  location?: {
    name?: {
      ar: string;
      en: string;
    };
    position?: {
      latitude?: number;
      longitude?: number;
    };
  };
  preview: string;
  src: string;
  unsplashId: string;
  url: string;
  version?: number;
}
