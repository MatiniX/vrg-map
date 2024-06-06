import { always, never } from 'ol/events/condition';
import { MultiLineString, Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import { useEffect, useState } from 'react';
import { RDraw } from 'rlayers/interaction';
import { getBearing } from '../lib/utils';
import { Coordinate } from 'ol/coordinate';
import { RFeature, ROverlay, useOL } from 'rlayers';
import { Fill, Stroke, Style } from 'ol/style';

interface MeasureAngleProps {
  condition: boolean;
}

interface AngleInfo {
  point: Point;
  uid: string;
  angle: number;
}

const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    width: 2,
  }),
});

const MeasureAngle = ({ condition }: MeasureAngleProps) => {
  const [loc, setLoc] = useState([0, 0]);
  const [angle, setAngle] = useState('');
  const [angles, setAngles] = useState<AngleInfo[]>([]);
  const map = useOL();

  useEffect(() => {
    map.map.addEventListener('clear', () => {
      setAngles([]);
      setAngle('');
    });
  }, [map]);

  return (
    <>
      <RDraw
        style={style}
        type="MultiLineString"
        maxPoints={3}
        minPoints={3}
        condition={condition ? always : never}
        onDrawStart={(e) => {
          const geom = e.feature.getGeometry()! as MultiLineString;
          geom.on('change', () => {
            const coords = geom.getCoordinates() as unknown as Coordinate[];
            if (coords.length >= 3) {
              const startLonLat = toLonLat(coords[0]);
              const midLonLat = toLonLat(coords[1]);
              const endLonLat = toLonLat(coords[2]);
              const bearingMidStart = getBearing(
                midLonLat[1],
                midLonLat[0],
                startLonLat[1],
                startLonLat[0]
              );
              const bearingMidEnd = getBearing(
                midLonLat[1],
                midLonLat[0],
                endLonLat[1],
                endLonLat[0]
              );
              let angle =
                bearingMidStart > bearingMidEnd
                  ? bearingMidStart - bearingMidEnd
                  : bearingMidEnd - bearingMidStart;

              if (angle > 180) angle = 360 - angle;

              setAngle(angle.toFixed(2) + '°');
              setLoc(midLonLat);
            }
          });
        }}
        onDrawEnd={(e) => {
          const geom = e.feature.getGeometry()! as MultiLineString;
          const coords = geom.getCoordinates()[0];
          const startLonLat = toLonLat(coords[0]);
          const midLonLat = toLonLat(coords[1]);
          const endLonLat = toLonLat(coords[2]);
          const bearingMidStart = getBearing(
            midLonLat[1],
            midLonLat[0],
            startLonLat[1],
            startLonLat[0]
          );
          const bearingMidEnd = getBearing(midLonLat[1], midLonLat[0], endLonLat[1], endLonLat[0]);
          let angle =
            bearingMidStart > bearingMidEnd
              ? bearingMidStart - bearingMidEnd
              : bearingMidEnd - bearingMidStart;

          if (angle > 180) angle = 360 - angle;

          setAngles([
            ...angles,
            { point: new Point(fromLonLat(midLonLat)), angle, uid: crypto.randomUUID() },
          ]);
        }}
      />
      {angle && (
        <RFeature geometry={new Point(fromLonLat(loc))}>
          <ROverlay className="angle-overlay">{angle}</ROverlay>
        </RFeature>
      )}

      {angles.map((angleInfo) => (
        <RFeature key={angleInfo.uid} geometry={angleInfo.point}>
          <ROverlay className="angle-overlay">{angleInfo.angle.toFixed(2) + '°'}</ROverlay>
        </RFeature>
      ))}
    </>
  );
};

export default MeasureAngle;
