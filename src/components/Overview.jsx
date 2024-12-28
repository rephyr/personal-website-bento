import React, { useState } from 'react';
import OverviewHoverfrom from './OverviewHover';
import OverviewContent from './OverviewContent';
import OverviewHover from './OverviewHover';

function Overview() {
  const [hidden, setHidden] = useState(true);

  return (
    <div className="col-span-2 row-span-1 rounded-xl bg-white outline outline-2 outline-pink-300 hover-grow"
         onClick={() => setHidden(false)}>
      {hidden ? <OverviewHover /> : <OverviewContent />}
    </div>
  );
}

export default Overview;