/**
 * Dependency imports
 */
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Component(s)
 */
const ImageContainer = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'isLoaded',
    'blurAmount',
    'fromPosition',
    'toPosition',
  ]).includes(prop.toString()),
})<{
  isLoaded: boolean,
  blurAmount: number,
  fromPosition?: PhotoPosition,
  toPosition?: PhotoPosition,
}>(({
  isLoaded,
  blurAmount,
  fromPosition,
  toPosition,
}) => css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0;
  
  ${isLoaded && css`
    animation: background-scale 30s both 400ms, background-fade-in 300ms both 400ms;
  `}

  @keyframes background-scale {
    from { transform: scale(1); }
    to { transform: scale(1.15); }
  }

  @keyframes background-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${blurAmount > 0 && css`
      filter: blur(${blurAmount}px);
      transform: scale(1.3);
    `}

    ${isLoaded && css`
      animation: background-slide 50000ms both ease-out;
    `}
    
    @keyframes background-slide {
      from { object-position: ${fromPosition?.replace('_', ' ')}; }
      to   { object-position: ${toPosition?.replace('_', ' ')}; }
    }

    /* ADMIN:  */
    /* object-position: ${(toPosition ?? fromPosition)?.replace('_', ' ')} */
  }
`);

const Overlay = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'color',
    'opacity',
  ]).includes(prop.toString()),
})<{
  color: string,
  opacity: number,
}>(({
  color,
  opacity,
}) => css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: ${color};
  animation: overlay-fade-in 150ms both 400ms;

  @keyframes overlay-fade-in {
    from { opacity: 0; }
    to { opacity: ${opacity}; }
  }
`);

/**
 * Background Component
 */
interface BackgroundProps {
  lowResURL: string,
  highResURL: string,
  overlayColor?: string,
  overlayOpacity?: number,
  fromPosition?: PhotoPosition,
  toPosition?: PhotoPosition,
}

const Background: React.FC<BackgroundProps & JSX.IntrinsicElements['div']> = ({
  lowResURL,
  highResURL,
  overlayColor,
  overlayOpacity,
  fromPosition,
  toPosition,
  ...props
}) => {
  const [shouldRenderLowRes, setShouldRenderLowRes] = React.useState(false);
  const [shouldRenderHighRes, setShouldRenderHighRes] = React.useState(false);
  const [lowResBackgroundLoaded, setLowResBackgroundLoaded] = React.useState(false);
  const [highResBackgroundLoaded, setHighResBackgroundLoaded] = React.useState(false);
  const onLowResBackgroundLoaded = () => setLowResBackgroundLoaded(true);
  const onHighResBackgroundLoaded = () => setHighResBackgroundLoaded(true);

  React.useEffect(() => {
    setShouldRenderLowRes(true);

    const timeout = setTimeout(() => {
      setShouldRenderHighRes(true);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div {...props}>
      {
        shouldRenderLowRes && (
          <ImageContainer isLoaded={lowResBackgroundLoaded} blurAmount={30} fromPosition={fromPosition} toPosition={toPosition}>
            <img src={lowResURL} alt="" onLoad={onLowResBackgroundLoaded} />
          </ImageContainer>
        )
      }
      
      {
        shouldRenderHighRes && (
          <ImageContainer isLoaded={highResBackgroundLoaded} blurAmount={0} fromPosition={fromPosition} toPosition={toPosition}>
            <img src={highResURL} alt="" onLoad={onHighResBackgroundLoaded} />
          </ImageContainer>
        )
      }
      
      <Overlay color={overlayColor!} opacity={overlayOpacity!} />
    </div>
  );
};

Background.defaultProps = {
  overlayColor: '#000',
  overlayOpacity: 0.5,
  fromPosition: 'center',
  toPosition: 'center_right',
};

export default Background;
