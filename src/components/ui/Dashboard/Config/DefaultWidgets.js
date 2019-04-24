export default [{
  i: 'w0',
  type: 'documentstatus',
  title: 'Document status',
  options: {
     collapse: false
  }
}, {
  i: 'w1',
  type: 'panel',
  title: 'Panel widget - things to do',
  options: {
    content: 'Work on the dashboard'
  }
}, {
  i: 'w2',
  type: 'smiley',
  title: 'Smiley widget - Mood today',
  options: {}
}, {
  i: 'w3',
  type: 'note',
  title: 'My notes',
  options: {
    backgroundColor: 'yellow',
    content: '<ul><li>fill out time report</li><li>Send form</li></ul>'
  }
}, {
  i: 'w4',
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
}]
