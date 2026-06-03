jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockMapView = props => React.createElement(View, props, props.children);
  const MockMarker = props => React.createElement(View, props, props.children);

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});
