import React, {useEffect, useCallback, useRef, useState, ChangeEvent,} from 'react';
import { hydrate } from '../../helper/hydrate';
import { useAppContext } from '../../helper/useAppContext';
import './styles.scss'
import {useSelectorTyped} from "../../helper/useSelectorTyped";
import { useDispatch } from 'react-redux';
import { setLevel } from '../../actions';

const getBaseSize = (totalFragments: number): number => {
  return [200, 300, 400, 500, 600, 700, 800, 900, 1000].filter(base => {
    const fragments = Math.ceil(base / totalFragments);

    return fragments * totalFragments === base;
  })[0];
};

type FieldInfo = {
  maxX: number,
  maxY: number,
  field: {
    width: number;
    height: number;
  },
  fragment: {
    width: number;
    height: number;
  },
};

const defaultInfo: FieldInfo = {
  maxX: 0,
  maxY: 0,
  field: {
    width: 0,
    height: 0,
  },
  fragment: {
    width: 0,
    height: 0,
  },
};
function PuzzlePage() {
  const {puzzleApi} = useAppContext();
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageSelector  = useSelectorTyped(state => state.puzzlePage)
  const level = pageSelector.level;
  const [currentLevel, setCurrentLevel] = useState<Level>(level);
  const [field, setField] = useState<{field: PuzzleField, info: FieldInfo}>({field: [], info: defaultInfo});
  const [preparing, setPreparing] = useState(false);

  const renderFragment = useCallback((x: number, y: number) => {
    const {info: {fragment: {width, height}}} = field;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    ctx.fillRect(x * width, y * height, width, height);
  }, [field]);

  const renderPuzzle = useCallback(() => {
    const {info: {maxY, maxX}} = field;

    for (let i = 0; i < maxY; i++) {
      for (let j = 0; j < maxX; j++) {
        for (let y = 0; y < 3; y++) {
          for (let x = 0; x < 3; x++) {
            if (field.field[i][j][y][x]) {
              renderFragment(j * 3 + x, i * 3 + y);
            }
          }
        }
      }
    }
  }, [field, renderFragment])

  const updateField = useCallback(() => {
    (async () => {
      const map = await puzzleApi.mapParsed();
      const field = hydrate(map);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) {
        return;
      }

      const [maxY, maxX] = [field.length, field[0]?.length];
      const [fieldHeight, fieldWidth] = [getBaseSize(maxY) * 3, getBaseSize(maxX) * 3];
      const [width, height] = [fieldHeight / maxY / 3, fieldWidth / maxX / 3];


      ctx.clearRect(0, 0, canvas.width, canvas.height);

      canvas.height = fieldHeight;
      canvas.width = fieldWidth;

      setField({
        field,
        info: {
          maxY,
          maxX,
          field: {
            width: fieldWidth,
            height: fieldHeight,
          },
          fragment: {
            width,
            height,
          },
        }
      });

      setPreparing(false);
    })();
    setPreparing(true);
  }, [puzzleApi, setPreparing]);

  const handleClick = useCallback(async ({nativeEvent: {offsetX, offsetY}}: React.MouseEvent<HTMLCanvasElement>) => {
    const {info: {fragment: {width, height}}} = field;
    const [x, y] = [Math.ceil(offsetX / width / 3) - 1, Math.ceil(offsetY / height / 3) - 1];

    if (preparing) {
      return;
    }

    await puzzleApi.rotate([x, y]);
    updateField();

  }, [puzzleApi, field, preparing]);
  useEffect(() => {
    setCurrentLevel(level);
  }, [level]);
  useEffect(() => {
    updateField();
  }, [level, updateField]);

  useEffect(() => {
    renderPuzzle();
  }, [field, renderPuzzle]);

  const handleCheckClick = useCallback(() => {
    puzzleApi.verify().then(msg => {
      alert(msg);
    });
  }, [puzzleApi]);

  const handleButtonClick = useCallback((e:ChangeEvent<HTMLSelectElement>) => {
    const  select = +e.target.value as Level;
    dispatch(setLevel(select));
  }, [dispatch, currentLevel]);

  return (
      <div className='container'>
        <div className='header'>
          <button  onClick={handleCheckClick} >Check</button>
          <div>
            <label>change level:</label>
            <select value={currentLevel} onChange={handleButtonClick}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>

        </div>
          <canvas ref={canvasRef}
                  className="canvas"
                  onClick={handleClick} />
          <div>
        </div>
      </div>
  );
}
export default PuzzlePage;

