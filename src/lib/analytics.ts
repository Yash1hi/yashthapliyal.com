import ReactGA from 'react-ga4';

export const analytics = {
  // Page tracking
  trackPageView: (path: string) => {
    ReactGA.send({ hitType: "pageview", page: path });
  },

  // Navigation events
  trackNavigation: (destination: string) => {
    ReactGA.event({
      category: 'Navigation',
      action: 'click',
      label: destination,
    });
  },

  // Photography events
  trackPhotoView: (photoName: string) => {
    ReactGA.event({
      category: 'Photography',
      action: 'photo_view',
      label: photoName,
    });
  },

  trackPhotoModalOpen: (photoName: string) => {
    ReactGA.event({
      category: 'Photography',
      action: 'modal_open',
      label: photoName,
    });
  },

  trackInstagramClick: () => {
    ReactGA.event({
      category: 'Social',
      action: 'instagram_click',
      label: '@yash1photos',
    });
  },

  // Contact form events
  trackContactFormStart: () => {
    ReactGA.event({
      category: 'Contact',
      action: 'form_start',
    });
  },

  trackContactFormSubmit: () => {
    ReactGA.event({
      category: 'Contact',
      action: 'form_submit',
    });
  },

  trackContactFormSuccess: () => {
    ReactGA.event({
      category: 'Contact',
      action: 'form_success',
    });
  },

  trackContactFormError: (error: string) => {
    ReactGA.event({
      category: 'Contact',
      action: 'form_error',
      label: error,
    });
  },

  // Blog events
  trackBlogPostView: (postTitle: string) => {
    ReactGA.event({
      category: 'Blog',
      action: 'post_view',
      label: postTitle,
    });
  },

  trackBlogPostShare: (postTitle: string, platform: string) => {
    ReactGA.event({
      category: 'Blog',
      action: 'post_share',
      label: `${postTitle} - ${platform}`,
    });
  },

  // Coffee tracker events
  trackCoffeeTrackerView: () => {
    ReactGA.event({
      category: 'Coffee Tracker',
      action: 'page_view',
    });
  },

  trackCoffeeAdd: (coffeeType?: string) => {
    ReactGA.event({
      category: 'Coffee Tracker',
      action: 'coffee_add',
      label: coffeeType,
    });
  },

  // P5 Sketch events
  trackP5SketchView: () => {
    ReactGA.event({
      category: 'P5 Sketch',
      action: 'page_view',
    });
  },

  trackP5Interaction: (interactionType: string) => {
    ReactGA.event({
      category: 'P5 Sketch',
      action: 'interaction',
      label: interactionType,
    });
  },

  // External link tracking
  trackExternalLink: (url: string, label?: string) => {
    ReactGA.event({
      category: 'External Link',
      action: 'click',
      label: label || url,
    });
  },

  // Scroll tracking
  trackScrollDepth: (depth: number, page: string) => {
    ReactGA.event({
      category: 'Scroll',
      action: 'depth',
      label: page,
      value: depth,
    });
  },

  // Error tracking
  trackError: (error: string, page: string) => {
    ReactGA.event({
      category: 'Error',
      action: 'javascript_error',
      label: `${page}: ${error}`,
    });
  },

  // Performance tracking
  trackPerformance: (metric: string, value: number, page: string) => {
    ReactGA.event({
      category: 'Performance',
      action: metric,
      label: page,
      value: Math.round(value),
    });
  },

  // Music widget events
  trackEvent: (action: string, properties?: Record<string, any>) => {
    ReactGA.event({
      category: 'Music Widget',
      action: action,
      label: properties ? JSON.stringify(properties) : undefined,
    });
  },

  trackSongPlayed: (songTitle: string, artist: string, position: number) => {
    ReactGA.event({
      category: 'Music Widget',
      action: 'song_played',
      label: `${songTitle} - ${artist}`,
      value: position,
    });
  },

  trackSongPaused: (songTitle: string, artist: string, position: number) => {
    ReactGA.event({
      category: 'Music Widget',
      action: 'song_paused',
      label: `${songTitle} - ${artist}`,
      value: position,
    });
  },

  trackExternalMusicLink: (platform: string, songTitle: string, artist: string) => {
    ReactGA.event({
      category: 'Music Widget',
      action: 'external_link_click',
      label: `${platform}: ${songTitle} - ${artist}`,
    });
  },

  trackTopSongsWidgetLoaded: (weekOf: string, songCount: number) => {
    ReactGA.event({
      category: 'Music Widget',
      action: 'widget_loaded',
      label: weekOf,
      value: songCount,
    });
  },

  trackTopSongsWidgetClosed: () => {
    ReactGA.event({
      category: 'Music Widget',
      action: 'widget_closed',
    });
  },

  trackTopSongsWidgetToggled: (action: string) => {
    ReactGA.event({
      category: 'Music Widget',
      action: 'widget_toggled',
      label: action,
    });
  },
};