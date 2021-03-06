import React from 'react';

import CORE_CHANGELOG from 'CHANGELOG';
import AVAILABLE_CONFIGS from 'Parser/AVAILABLE_CONFIGS';
import Changelog from './Changelog';

class ChangelogPanel extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      expanded: false,
      changelogType: 0,
    };
  }

  render() {
    const limit = this.state.expanded ? null : 10;

    return (
      <div className="panel">
        <div className="panel-heading">
          <select className="form-control" value={this.state.changelogType} onChange={e => this.setState({ changelogType: Number(e.target.value) })}>
            <option value={0}>Core</option>
            {AVAILABLE_CONFIGS.map(config => (
              <option value={config.spec.id} key={config.spec.id}>{config.spec.specName} {config.spec.className}</option>
            ))}
          </select>
        </div>
        <div className="panel-body">
          <div style={{ margin: '-15px -22px 0 -22px' }}>
            <Changelog
              changelog={this.state.changelogType ? AVAILABLE_CONFIGS.find(config => config.spec.id === this.state.changelogType).changelog : CORE_CHANGELOG}
              limit={limit}
              includeCore={!!this.state.changelogType}
            />
          </div>
          {limit !== null && (
            <a onClick={() => this.setState({ expanded: true })}>More</a>
          )}
        </div>
      </div>
    );
  }
}

export default ChangelogPanel;
