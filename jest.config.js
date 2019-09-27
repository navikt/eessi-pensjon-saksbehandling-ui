
module.exports = {

  roots: [
    '<rootDir>/src'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  transformIgnorePatterns: [
    'node_modules/eessi-pensjon-ui/src/.*'
  ],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|svg|css|less)$': 'identity-obj-proxy'
  }
}
