import React from "react";
import styles from "./{{exports}}.css";

/**
 * {{description}}
 *
 * @exports {{exports}}
 * @extends {{extends}}
 * @see {{issue-link}}
 */
export default class {{exports}} extends {{extends}} {

  // propTypes
  static propTypes = {}

  // defaultProps
  static defaultProps = {}

  /**
   * Render {{exports}} Component
   * @return {ReactElement} {{exports}}
   */
  render() {
    const rootClass = styles.root;

    return(
      <div className={rootClass}>
        {{exports}}
      </div>
    )
  }
}
