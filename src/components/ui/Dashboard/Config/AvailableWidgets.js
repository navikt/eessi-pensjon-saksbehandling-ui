export default [{
  type: 'ekspandertbart',
  title: 'Ekspandertbart widget',
  description: 'Widget that can collapse',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, maxH: Infinity, defaultH: 6 },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 2, maxH: Infinity, defaultH: 3 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, maxH: Infinity, defaultH: 3 }
  },
  options: {
    collapsed: false
  }
}, {
  type: 'documentstatus',
  title: 'Document Status widget',
  description: 'Widget with document status',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, maxH: Infinity, defaultH: 6 },
    md: { minW: 3, maxW: 3, defaultW: 3, minH: 2, maxH: Infinity, defaultH: 3 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, maxH: Infinity, defaultH: 3 }
  },
  options: {
    collapsed: false
  }
}, {
  type: 'links',
  title: 'Links widget',
  description: 'Widget with links',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: Infinity },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity }
  },
  options: {}
}, {
  type: 'panel',
  title: 'Panel widget',
  description: 'Widget that is a basic panel',
  layout: {
    lg: { minW: 2, maxW: 12, defaultW: 3, minH: 3, defaultH: 3, maxH: Infinity },
    md: { minW: 1, maxW: 3, defaultW: 1, minH: 3, defaultH: 3, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 3, defaultH: 3, maxH: Infinity }
  },
  options: {}
}, {
  type: 'smiley',
  title: 'Smiley widget',
  description: 'Widget with a 😀',
  layout: {
    lg: { minW: 2, maxW: 4, defaultW: 2, minH: 6, defaultH: 6, maxH: Infinity },
    md: { minW: 1, maxW: 3, defaultW: 1, minH: 6, defaultH: 6, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 6, defaultH: 6, maxH: Infinity }
  },
  options: {}
}, {
  type: 'cat',
  title: 'Cat widget',
  description: 'A 🐈 in a widget',
  layout: {
    lg: { minW: 4, maxW: 6, defaultW: 4, minH: 5, defaultH: 5, maxH: Infinity },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 5, defaultH: 5, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 5, defaultH: 5, maxH: Infinity }
  },
  options: {}
}, {
  type: 'note',
  title: 'Note widget',
  description: 'Post-it notes',
  layout: {
    lg: { minW: 4, maxW: 6, defaultW: 4, minH: 5, defaultH: 5, maxH: Infinity },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 5, defaultH: 5, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 5, defaultH: 5, maxH: Infinity }
  },
  options: {
    backgroundColor: 'yellow',
    availableColors: ['white', 'yellow', 'orange', 'pink', 'lightgreen']
  }
}, {
   type: 'person',
   title: 'Person widget',
   description: 'Widget with person info',
   layout: {
     lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: Infinity },
     md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity },
     sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity }
   },
   options: {}
}, {
   type: 'sedlist',
   title: 'SED List widget',
   description: 'Widget with Sed list',
   layout: {
     lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: Infinity },
     md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity },
     sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity }
   },
   options: {}
}]
