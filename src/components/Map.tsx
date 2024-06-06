import 'ol/ol.css'; // Import OpenLayers CSS
import { useEffect, useState } from 'react';
import { RControl, RLayerVector, RMap, ROSM } from 'rlayers';
import MeasureDistance from './MeasureDistance';
import MeasureAngle from './MeasureAngle';
import PolyLineDraw from './PolyLineDraw';
import RulerIcon from './RulerIcon';
import AngleIcon from './AngleIcon';
import PolylineIcon from './PolylineIcon';
import ClearButton from './ClearButton';

const activeColor = '#ff8686';

const MapComponent = () => {
  const [isMeasuringDist, setIsMeasuringDist] = useState(false);
  const [isMeasuringAngle, setIsMeasuringAngle] = useState(false);
  const [isDrawingPolyLine, setIsDrawingPolyLine] = useState(false);
  const [cursor, setCursor] = useState('default');

  useEffect(() => {
    if (isMeasuringDist || isMeasuringAngle || isDrawingPolyLine) {
      setCursor('crosshair');
    } else {
      setCursor('default');
    }
  }, [isMeasuringAngle, isMeasuringDist, isDrawingPolyLine]);

  return (
    <div style={{ cursor: cursor }}>
      <RMap width="100%" height="100vh" initial={{ center: [0, 0], zoom: 0 }}>
        <ROSM />
        <RControl.RCustom className="measurment-control">
          <button
            style={{ backgroundColor: isMeasuringDist ? activeColor : 'white' }}
            onClick={() => {
              setIsMeasuringAngle(false);
              setIsDrawingPolyLine(false);
              setIsMeasuringDist(!isMeasuringDist);
            }}
          >
            <RulerIcon />
          </button>
        </RControl.RCustom>
        <RControl.RCustom className="angle-control">
          <button
            style={{ backgroundColor: isMeasuringAngle ? activeColor : 'white' }}
            onClick={() => {
              setIsMeasuringDist(false);
              setIsDrawingPolyLine(false);
              setIsMeasuringAngle(!isMeasuringAngle);
            }}
          >
            <AngleIcon />
          </button>
        </RControl.RCustom>
        <RControl.RCustom className="polyline-control">
          <button
            style={{ backgroundColor: isDrawingPolyLine ? activeColor : 'white' }}
            onClick={() => {
              setIsMeasuringDist(false);
              setIsMeasuringAngle(false);
              setIsDrawingPolyLine(!isDrawingPolyLine);
            }}
          >
            <PolylineIcon />
          </button>
        </RControl.RCustom>

        <RControl.RCustom className="clear-control">
          <ClearButton />
        </RControl.RCustom>
        <RLayerVector attributions="main">
          <MeasureDistance condition={isMeasuringDist} />
          <MeasureAngle condition={isMeasuringAngle} />
          <PolyLineDraw condition={isDrawingPolyLine} />
        </RLayerVector>
      </RMap>
    </div>
  );
};

export default MapComponent;
