/*eslint-env node, mocha */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import expect from 'expect';
import {{exports}} from '../components/{{exports}}/{{exports}}.jsx';

describe('root', () => {
  it('{{exports}} renders without problems', () => {
    const sidebar = TestUtils.renderIntoDocument(<{{exports}} />);
    expect({{exports}}).toExist();
  });
});
