import React from 'react';
import styles from './{%=o.exportsLowerCase%}.css';
{%   if (o.importlist.indexOf("purecomponent") > -1)  { %}import PureComponent from 'react-pure-render/component';
{% } if (o.importlist.indexOf("classnames") > -1)     { %}import cx from 'classnames';
{% } if (o.importlist.indexOf("proptypes") > -1)      { %}import PropTypes from 'utils/prop-types';
{% } %}
/**
 * {%=o.description%}
 *
 * @exports {%=o.exports%}
 * @extends {%=o.extends%}
 * @see {%=o.ticketLink%}
 */

export default class {%=o.exports%} extends {%=o.extends%} {
  {% if (o.includeprops) { %}
  // propTypes
  static propTypes = {}

  // defaultProps
  static defaultProps = {}
  {% } %}
  /**
   * Render {%=o.exports%} Component
   * @return {ReactElement} {%=o.exports%}
   */
  render() {
    const rootClass = styles.{%= o.rootstyle %};

    return(
      <div className={rootClass}>
        {%=o.exports%}
      </div>
    )
  }
}
