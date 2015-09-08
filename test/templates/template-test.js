/*eslint-env mocha */

/**
 * Component Test for {%=o.exports%}
 *
 * {%=o.description%}
 *
 * @see {%=o.ticketLink%}
 */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import expect from 'expect';
import {%=o.exports%} from '../components/{%=o.exportsLowerCase%}/{%=o.exportsLowerCase%}.jsx';

describe('root', () => {
  it('{%=o.exports%} renders without problems', () => {
    const {%=o.exportsLowerCase%} = TestUtils.renderIntoDocument(<{%=o.exports%} />);
    expect({%=o.exportsLowerCase%}).toExist();
  });
});
