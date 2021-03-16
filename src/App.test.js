import React from 'react';
import renderer from 'react-test-renderer';
import App from './App.js';

test('App renders', () => {
  const component = renderer.create(
    <App/>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
