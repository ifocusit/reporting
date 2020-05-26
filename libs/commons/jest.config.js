module.exports = {
  name: 'commons',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/commons',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
