/**
 * Dependency imports
 */
import React from 'react';
import classnames from 'classnames';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Color from 'color';

/**
 * Local imports
 */
import Text, { Props as TextProps } from './Text';
import { raf } from '../../utils/animation';

/**
 * Types
 */
type Segment = {
  points: [[x0: number, y0: number], [x1: number, y1: number]],
  size: number,
};

type State = {
  size: number,
  mouseX: number,
  mouseY: number,
  activeX: number,
  activeY: number,
  isActive: boolean,
  segments: Segment[],
};

/**
 * Constants
 */
const CANVAS_SCALE = 2;

/**
 * Helpers
 */
const getContext = (canvas: HTMLCanvasElement) => canvas && canvas.getContext('2d');

const clearCanvas = (canvas: HTMLCanvasElement) => {
  const context = getContext(canvas);
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const applyCanvasStyles = (canvas: HTMLCanvasElement, color: string) => {
  const context = getContext(canvas);
  if (!context) return;
  context.globalCompositeOperation = 'source-over';
  context.strokeStyle = color;
  context.lineCap = 'round';
};

const applyInvertedCanvasStyles = (canvas: HTMLCanvasElement, color: string) => {
  const context = getContext(canvas);
  if (!context) return;
  context.globalCompositeOperation = 'source-out';
  context.fillStyle = color;
  context.rect(0, 0, canvas.width, canvas.height);
  context.fill();
};

const drawMouseCursor = (canvas: HTMLCanvasElement, mouseX: number, mouseY: number, size: number) => {
  const context = getContext(canvas);
  if (!context) return;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(mouseX, mouseY, 0.5 * size, 0, 2 * Math.PI);
  context.stroke();
};

const drawSegment = (canvas: HTMLCanvasElement, x0: number, y0: number, x1: number, y1: number, size: number) => {
  const context = getContext(canvas);
  if (!context) return;
  context.lineWidth = size;
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.stroke();
};

const drawSegments = (canvas: HTMLCanvasElement, segments: Segment[]) => {
  segments.forEach((segment) => {
    drawSegment(
      canvas,
      segment.points[0][0] * canvas.width,
      segment.points[0][1] * canvas.height,
      segment.points[1][0] * canvas.width,
      segment.points[1][1] * canvas.height,
      segment.size * canvas.width,
    );
  });
};

const segmentsToStr = (segments: Segment[]) => segments.map(
  segment => (
    `${segment.points.map(
      point => point.join(',')
    ).join(':')}:${segment.size}`
  )
).join(';');

const strToSegments = (str: string): Segment[] => str.split(';').map(
  (segment) => {
    const [
      pointA,
      pointB,
      size,
    ] = segment.split(':');

    return {
      points: [pointA.split(',').map(Number), pointB.split(',').map(Number)],
      size: +size,
    } as Segment;
  }
);

const round = (value: number) => +value.toFixed(4);

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'diacriticsMask',
    'textMask',
    'diacriticsColor',
    'textColor',
    'inline',
    'editor',
    'previewMode',
  ]).includes(prop.toString()),
})<Partial<StyledDiacriticsCombinedProps & {
  diacriticsMask: string,
  textMask: string,
  inline: boolean,
  previewMode: boolean,
}>>((props) => css`
  position: relative;
  display: ${props.inline ? 'inline-block' : 'block'};

  .wb-styled-diacritics__diacritics,
  .wb-styled-diacritics__text {
    display: inline-block;
    padding: 0.35em;
    margin: -0.35em;
    text-shadow: none;
    background-size: 100%;
    background-clip: text;
    background-repeat: no-repeat;
    background-position: 0 0;
    -webkit-text-fill-color: rgba(0, 0, 0, 0);
  }

  .wb-styled-diacritics__diacritics {
    background-image: url(${props.diacriticsMask});
    -webkit-font-smoothing: subpixel-antialiased;
  }

  .wb-styled-diacritics__text {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-image: url(${props.textMask});
  }

  canvas {
    display: ${!props.editor || props.previewMode ? 'none' : 'block'};
    position: absolute;
    top: -0.35em;
    left: -0.35em;
    width: calc(100% + 2 * 0.35em);
    height: calc(100% + 2 * 0.35em);
    background: ${Color(props.diacriticsColor).alpha(0).string()};
    transition: 200ms background-color;
    
    &:hover {
      z-index: 1;
      background: ${Color(props.diacriticsColor).alpha(0.2).string()};
    }
  }
`);

/**
 * StyledDiacritics Component
 */
export interface StyledDiacriticsProps {
  text: string,
  data?: string,
  diacriticsColor?: string,
  textColor?: string,
  editor?: boolean,
  onEdit?: (segmentsAsStr: string) => void,
}

export type StyledDiacriticsCombinedProps = StyledDiacriticsProps & TextProps & JSX.IntrinsicElements['div'];

const StyledDiacritics: React.FC<StyledDiacriticsCombinedProps> = ({
  text,
  data,
  diacriticsColor,
  textColor,
  type,
  offset,
  inline,
  weight,
  light,
  bold,
  smoothing,
  editor,
  onEdit,
  ...props
}) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [diacriticsMask, setDiacriticsMask] = React.useState<string>();
  const [textMask, setTextMask] = React.useState<string>();
  const [segmentsData, setSegmentsData] = React.useState<string | undefined>(data);
  const [previewMode, setPreviewMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    setSegmentsData(data);
  }, [data]);

  React.useEffect(() => {
    // create the canvas element
    const canvas = rootRef.current?.querySelector('canvas');

    if (!canvas) return;

    // clear
    clearCanvas(canvas);

    // init
    const state: State = {
      size: 24,
      mouseX: 0,
      mouseY: 0,
      activeX: 0,
      activeY: 0,
      isActive: false,
      segments: segmentsData ? strToSegments(segmentsData) : [],
    };

    // resize the canvas element and add padding
    const cancelCanvasResize = raf(() => {
      if (canvas) {
        const textContainer = rootRef.current?.querySelector('.wb-styled-diacritics__text') as HTMLElement;

        canvas.width = CANVAS_SCALE * textContainer?.offsetWidth;
        canvas.height = CANVAS_SCALE * textContainer?.offsetHeight;

        if (segmentsData) {
          applyCanvasStyles(canvas, diacriticsColor!);
          drawSegments(canvas, strToSegments(segmentsData));
          setDiacriticsMask(canvas.toDataURL());
        }

        applyInvertedCanvasStyles(canvas, textColor!);
        setTextMask(canvas.toDataURL());
      }
    }, 50);

    // editor mode
    if (!editor) return () => { cancelCanvasResize(); }

    const onMouseDown = (e: MouseEvent) => {
      state.isActive = true;
      state.activeX = state.mouseX;
      state.activeY = state.mouseY;

      const onMouseUp = (e: MouseEvent) => {
        state.isActive = false;
        state.segments.push({
          points: [
            [round(state.activeX / canvas.width), round(state.activeY / canvas.height)],
            [round(state.mouseX / canvas.width), round(state.mouseY / canvas.height)],
          ],
          size: round(state.size / canvas.width),
        });

        onEdit?.(segmentsToStr(state.segments));

        setDiacriticsMask(canvas.toDataURL());

        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;

      const box = canvas.getBoundingClientRect();

      state.mouseX = CANVAS_SCALE * (e.pageX - box.left);
      state.mouseY = CANVAS_SCALE * (e.pageY - box.top);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '-') {
        state.size = Math.max(1, state.size - 1);
      }

      if (e.key === '=') {
        state.size = Math.min(50, state.size + 1);
      }

      if (e.key === 'p') {
        setSegmentsData(segmentsToStr(state.segments));
        setPreviewMode(v => !v);
      }

      if (e.key === 'c') {
        setSegmentsData('');
        clearCanvas(canvas);
      }

      if (e.key === 'Enter') {
        const output = segmentsToStr(state.segments);
        console.log(output);
        window.prompt('Output', output);

        window.data = window.data ?? {};
        window.data[window.s] = output;
        window.nextSura();
        setPreviewMode(true);

        setTimeout(() => {
          clearCanvas(canvas);
          setPreviewMode(false);
        }, 10);
      }
    };

    const cancelEditorUpdater = raf(() => {
      if (previewMode) return;

      clearCanvas(canvas);

      applyCanvasStyles(canvas, diacriticsColor!);

      // draw mouse
      drawMouseCursor(canvas, state.mouseX, state.mouseY, state.size);

      if (state.isActive) {
        drawSegment(
          canvas,
          state.activeX,
          state.activeY,
          state.mouseX,
          state.mouseY,
          state.size,
        );
      }

      // draw data
      drawSegments(canvas, state.segments);
    });

    canvas?.addEventListener('mousedown', onMouseDown);
    window?.addEventListener('mousemove', onMouseMove);
    window?.addEventListener('keydown', onKeyDown);

    return () => {
      cancelCanvasResize();
      cancelEditorUpdater();

      canvas?.removeEventListener('mousedown', onMouseDown);
      window?.removeEventListener('mousemove', onMouseMove);
      window?.removeEventListener('keydown', onKeyDown);
    };
  }, [segmentsData, diacriticsColor, textColor, previewMode, editor, onEdit]);

  return (
    <Root
      {...props}
      ref={rootRef}
      diacriticsMask={diacriticsMask}
      textMask={textMask}
      diacriticsColor={diacriticsColor}
      textColor={textColor}
      inline={inline}
      editor={editor}
      previewMode={previewMode}
      className={classnames('wb-styled-diacritics', props.className)}
    >
      <Text
        type={type}
        offset={offset}
        inline={inline}
        weight={weight}
        light={light}
        bold={bold}
        smoothing={smoothing}
      >
        <span className="wb-styled-diacritics__diacritics">
          {text}
        </span>

        <span className="wb-styled-diacritics__text">
          {text}
        </span>

        <canvas />
      </Text>
    </Root>
  );
};

StyledDiacritics.defaultProps = {
  diacriticsColor: 'black',
  textColor: 'white',
  editor: false,
  onEdit: () => null,
  ...Text.defaultProps,
};

export default StyledDiacritics;
