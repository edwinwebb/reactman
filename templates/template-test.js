/*eslint-env node, mocha */

/**
 * Component Test for {{exports}}
 *
 * {{description}}
 *
 * @see {{ticketLink}}
 */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import expect from 'expect';
import {{exports}} from '../components/{{exportsLowerCase}}/{{exportsLowerCase}}.jsx';

describe('root', () => {
  it('{{exports}} renders without problems', () => {
    const {{exportsLowerCase}} = TestUtils.renderIntoDocument(<{{exports}} />);
    expect({{exportsLowerCase}}).toExist();
  });
});
