import { Cartesian3, Color } from 'cesium'
import React, { useState } from 'react';
import { Entity, Viewer } from 'resium'




export default function Cesium() {
  const [flag, setFlag] = useState(false);

  return (
    <Viewer full>
      <Entity
        name="world"
        position={Cartesian3.fromDegrees(0, 0, 100)}
        point={{ pixelSize: 20, color: Color.WHITE }}
        description="hoge"
        onClick={() => setFlag(f => !f)}
      />
      {flag && (
        <Entity
          position={Cartesian3.fromDegrees(0, 0, 100)}
          point={{ pixelSize: 20, color: Color.RED }}
        />
      )}
    </Viewer>
  )
}
