export default [{
  i: 'w-0-documentstatus',
  type: 'documentstatus',
  title: 'Document status',
  options: {
    collapse: false
  }
}, {
  i: 'w-1-panel',
  type: 'panel',
  title: 'Panel widget - things to do',
  options: {
    content: 'Work on the dashboard'
  }
}, {
  i: 'w-2-smiley',
  type: 'smiley',
  title: 'Smiley widget - Mood today',
  options: {
    mood: '😁',
    backgroundColor: 'white'
  }
}, {
  i: 'w-3-notes',
  type: 'note',
  title: 'My notes',
  options: {
    backgroundColor: 'yellow',
    content: '<ul><li>fill out time report</li><li>Send form</li></ul>'
  }
}, {
  i: 'w-4-ekspandertbart',
  type: 'ekspandertbart',
  title: 'Expandable widget - Pending tasks',
  options: {
    collapsed: false,
    content: 'Task 1: Buy eggs.<br />\n' +
    'Task 2: Buy milk.<br />\n' +
    'Task 3: Buy butter.<br />\n' +
    'Task 4: Buy potatoes.<br />\n' +
    'Task 5: Buy bread.<br />\n' +
    'Task 6: Buy sugar.<br />\n' +
    'Task 7: Buy toilet paper.<br />\n' +
    'Task 8: Buy beer.<br />'
  }
}, {
  i: 'w-5-links',
  type: 'links',
  title: 'Links widget',
  options: {}
}, {
  i: 'w-6-person',
  type: 'person',
  title: 'Person widget',
  options: {}
}, {
  i: 'w-7-sedlist',
  type: 'sedlist',
  title: 'Sed list widget',
  options: {}
}, {
  i: 'w-8-pdf',
  type: 'pdf',
  title: 'PDF widget',
  options: {}
}]
