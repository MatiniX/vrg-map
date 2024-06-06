import { always, doubleClick, never, platformModifierKey, shiftKeyOnly } from 'ol/events/condition';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { RLayerVector } from 'rlayers';
import { RDraw, RModify } from 'rlayers/interaction';

interface PolyLineDrawProps {
  condition: boolean;
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

const modifyStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      width: 2,
    }),
  }),
});

const layerStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    width: 2,
  }),
});

const noStyle = new Style({});

const PolyLineDraw = ({ condition }: PolyLineDrawProps) => {
  return (
    <RLayerVector style={layerStyle}>
      <RDraw
        style={style}
        condition={condition ? always : never}
        type="MultiLineString"
        finishCondition={shiftKeyOnly}
        freehandCondition={never}
      />
      <RModify
        style={condition ? modifyStyle : noStyle}
        condition={condition ? platformModifierKey : never}
        deleteCondition={(e) => platformModifierKey(e) && doubleClick(e)}
      />
    </RLayerVector>
  );
};

export default PolyLineDraw;
