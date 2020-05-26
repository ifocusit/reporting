module.exports = {
  name: 'timbrage',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/timbrage',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
