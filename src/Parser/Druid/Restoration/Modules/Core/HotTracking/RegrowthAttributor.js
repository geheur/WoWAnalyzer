import SPELLS from 'common/SPELLS';
import Analyzer from 'Parser/Core/Analyzer';

import HotTracker from './HotTracker';

const BUFFER_MS = 150; // saw a few cases of taking close to 150ms from cast -> applybuff

/*
 * Backend module tracks attribution of Regrowth
 * TODO - Dead module?
 */
class RegrowthAttributor extends Analyzer {
  static dependencies = {
    hotTracker: HotTracker,
  };


  // cast tracking stuff
  lastRegrowthCastTimestamp;
  lastRegrowthTarget;

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    const targetId = event.targetID;

    // set last cast timestamps, used for attribution of HoT applications later
    if (spellId === SPELLS.REGROWTH.id) {
      this.lastRegrowthCastTimestamp = event.timestamp;
      this.lastRegrowthTarget = targetId;
    }
  }

  on_byPlayer_applybuff(event) {
    this._getRegrowthAttribution(event);
  }

  on_byPlayer_refreshbuff(event) {
    this._getRegrowthAttribution(event);
  }

  // gets attribution for a given applybuff/refreshbuff of Regrowth
  _getRegrowthAttribution(event) {
    const spellId = event.ability.guid;
    const targetId = event.targetID;
    if (spellId !== SPELLS.REGROWTH.id) {
      return;
    }
    if(!this.hotTracker.hots[targetId] || !this.hotTracker.hots[targetId][spellId]) {
      return;
    }

    const timestamp = event.timestamp;
    const attributions = [];

    if (event.prepull || (this.lastRegrowthCastTimestamp + BUFFER_MS > timestamp && this.lastRegrowthTarget === targetId)) { // regular cast (assume prepull applications are hardcast)
      // standard hardcast gets no special attribution
    } else {
      console.warn(`Unable to attribute Regrowth @${this.owner.formatTimestamp(timestamp)} on ${targetId}`);
    }

    attributions.forEach(att => {
      this.hotTracker.addAttribution(att, targetId, spellId);
    });
  }

}

export default RegrowthAttributor;
