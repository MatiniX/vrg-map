import { always, never } from 'ol/events/condition';
import { Geometry, LineString, Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import { getLength } from 'ol/sphere';
import { Fill, Stroke, Style } from 'ol/style';
import { createRef, useEffect, useRef, useState } from 'react';
import { RFeature, RInteraction, ROverlay, useOL } from 'rlayers';
import { RStroke, RStyle } from 'rlayers/style';
import { getBearing, radians } from '../lib/utils';
import { offset } from 'ol/sphere';
import { RDraw } from 'rlayers/interaction';

interface OverlayInfo {
  point: Point;
  uid: string;
  distance: string;
  bearing: string;
}

const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
});

interface MeasureDistanceProps {
  condition: boolean;
}

const MeasureDistance = ({ condition }: MeasureDistanceProps) => {
  const drawRef = createRef() as React.RefObject<RDraw>;
  const bearingInputRef = useRef<HTMLInputElement>(null);
  const distanceInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [formatedDist, setFormatedDist] = useState('');
  const [formatedBearing, setFormatedBearing] = useState('');
  const [loc, setLoc] = useState([0, 0]);
  const [measurmentOverlays, setMeasurmentOverlays] = useState<OverlayInfo[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currGeom, setCurrGeom] = useState<LineString>();
  const geomRef = useRef<LineString>();
  const map = useOL();

  const formatLength = function (line: Geometry) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
  };

  useEffect(() => {
    const allOverlays = document.querySelectorAll('.distance-overlay');
    allOverlays.forEach((overlay) => {
      overlay.parentElement?.style.setProperty('pointer-events', 'none');
    });

    document.addEventListener('keydown', (e) => {
      if (condition && isDrawing && e.key === 'Tab') {
        setIsEditMode(true);
        console.log(document.activeElement, bearingInputRef.current);
        if (isEditMode && bearingInputRef.current === document.activeElement) {
          e.preventDefault();
          bearingInputRef.current?.blur();
          distanceInputRef.current?.focus();
        }
      }
    });
  }, [isDrawing, condition, isEditMode]);

  useEffect(() => {
    map.map.addEventListener('clear', () => {
      setMeasurmentOverlays([]);
    });
  }, [map]);

  return (
    <>
      <RInteraction.RDraw
        ref={drawRef}
        condition={condition ? always : never}
        style={style}
        type={'LineString'}
        maxPoints={2}
        minPoints={2}
        onDrawStart={(e) => {
          const geom = e.feature.getGeometry() as LineString;
          const startCoord = geom.getLastCoordinate();
          const startLonLat = toLonLat(startCoord);
          geomRef.current = geom;

          geom.on('change', (e) => {
            const geom = e.target;
            const tooltipCoord = geom.getLastCoordinate();
            const lonLat = toLonLat(tooltipCoord);
            setLoc(lonLat);
            const output = formatLength(geom);
            const bearing = getBearing(startLonLat[1], startLonLat[0], lonLat[1], lonLat[0]);

            const bearingOutput = bearing.toFixed(2) + '°';

            setFormatedDist(output);
            setFormatedBearing(bearingOutput);
          });
          setCurrGeom(geom);
          setIsDrawing(true);
        }}
        onDrawEnd={(e) => {
          let geom: LineString;
          if (geomRef.current && geomRef.current.getCoordinates().length === 2) {
            geom = geomRef.current;
            e.feature.setGeometry(geom.clone());
          } else {
            geom = e.feature.getGeometry() as LineString;
          }
          const coord = geom.getLastCoordinate();
          const point = new Point(coord);
          const output = formatLength(geom);

          const coords = geom.getCoordinates();

          const startCords = toLonLat(coords[0]);
          const endCords = toLonLat(coords[1]);
          const bearing = getBearing(startCords[1], startCords[0], endCords[1], endCords[0]);
          const bearingOutput = bearing.toFixed(2) + '°';
          const uid = crypto.randomUUID();
          const overlayInfo = { point, uid, distance: output, bearing: bearingOutput };

          setMeasurmentOverlays([...measurmentOverlays, overlayInfo]);

          setIsDrawing(false);
          setIsEditMode(false);
          geomRef.current = undefined;
        }}
      />
      <RStyle>
        <RStroke color={'#000'} width={1} />
      </RStyle>

      {isDrawing && (
        <RFeature geometry={new Point(fromLonLat(loc))}>
          {isEditMode ? (
            <ROverlay className="distance-overlay">
              <form
                className="measure-distance-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const regex = /([0-9.]+)(\D*)/;
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const distanceStr = formData.get('distance') as string;
                  const bearingStr = formData.get('bearing') as string;

                  if (!distanceStr || !bearingStr) {
                    return;
                  }

                  const distanceMatch = distanceStr.match(regex);

                  let distance: number;
                  if (distanceMatch) {
                    const numberPart = distanceMatch[1];
                    const characterPart = distanceMatch[2];
                    switch (characterPart) {
                      case 'km':
                        distance = Number(numberPart) * 1000;
                        break;
                      case 'm':
                        distance = Number(numberPart);
                        break;

                      default:
                        distance = Number(numberPart);
                        break;
                    }
                  }

                  const bearingMatch = bearingStr.match(regex);

                  let bearing: number;
                  if (bearingMatch) {
                    const numberPart = bearingMatch[1];
                    const characterPart = bearingMatch[2];
                    switch (characterPart) {
                      case 'rad':
                        bearing = Number(numberPart);
                        break;

                      default:
                        bearing = radians(Number(numberPart));
                        break;
                    }
                  }

                  if (currGeom) {
                    const coords = currGeom.getCoordinates();
                    const startLonLat = toLonLat(coords[0]);

                    const desiredEndCoord = offset(startLonLat, distance!, bearing!);
                    currGeom.setCoordinates([coords[0], fromLonLat(desiredEndCoord)]);
                    geomRef.current = currGeom.clone();

                    drawRef.current?.ol.finishDrawing();
                  }
                }}
              >
                <input ref={distanceInputRef} name="distance" placeholder="Desired distance" />
                <input ref={bearingInputRef} name="bearing" placeholder="Desired bearing" />
                <button type="submit" hidden />
              </form>
            </ROverlay>
          ) : (
            <ROverlay className="distance-overlay">
              <p>{formatedDist}</p>
              <p>{formatedBearing}</p>
            </ROverlay>
          )}
        </RFeature>
      )}

      {measurmentOverlays.map((overlay) => (
        <RFeature key={overlay.uid} geometry={overlay.point}>
          <ROverlay className="distance-overlay">
            <p>{overlay.distance}</p>
            <p>{overlay.bearing}</p>
          </ROverlay>
        </RFeature>
      ))}
    </>
  );
};

export default MeasureDistance;
