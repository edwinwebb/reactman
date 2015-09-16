import React from "react";
import styles from "./{%=o.exportsLowerCase%}.css";

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
