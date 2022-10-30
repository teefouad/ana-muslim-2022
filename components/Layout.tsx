/**
 * Dependency imports
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

/**
 * Local imports
 */
import { toRem } from '../utils/text';

/**
 * Types
 */
type LayoutAreaComponent = React.FC<{ children: React.ReactNode }>;

/**
 * Root
 */
const Root = styled.div`
  position: absolute;
  top: ${toRem(40)};
  left: ${toRem(40)};
  right: ${toRem(40)};
  bottom: ${toRem(40)};

  [data-layout-area] { position: absolute; }

  [data-layout-area^="top-"] { top: 0; }
  [data-layout-area^="middle-"] { top: 50%; transform: translateY(-50%); }
  [data-layout-area^="bottom-"] { bottom: 0; }
  
  [data-layout-area$="-start"] { inset-inline-start: 0; }
  [data-layout-area$="-center"] { left: 50%; transform: translateX(-50%); }
  [data-layout-area$="-end"] { inset-inline-end: 0; }

  [data-layout-area="main"] {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    top: 0;
    left: 50%;
    bottom: 0;
    text-align: center;
    transform: translateX(-50%);
  }
`;

const createLayoutAreaComponent = (areaName: string): LayoutAreaComponent => ({ children }) => {
  const [areaElement, setAreaElement] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const el = document.querySelector(`[data-layout-area="${areaName}"]`);

      if (el) {
        setAreaElement(el);
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, []);

  if (areaElement) {
    return ReactDOM.createPortal(children, areaElement);
  }

  return null;
};

/**
 * Layout Component
 */
interface Props {
  [prop: string]: any,
}

interface LayoutAreas {
  TopStart: LayoutAreaComponent,
  TopCenter: LayoutAreaComponent,
  TopEnd: LayoutAreaComponent,
  MiddleStart: LayoutAreaComponent,
  Main: LayoutAreaComponent,
  MiddleEnd: LayoutAreaComponent,
  BottomStart: LayoutAreaComponent,
  BottomCenter: LayoutAreaComponent,
  BottomEnd: LayoutAreaComponent,
}

const Layout: React.FC<Props & JSX.IntrinsicElements['div']> & LayoutAreas = ({ children }) => {
  return (
    <Root>
      <div data-layout-area="top-start" />
      <div data-layout-area="top-center" />
      <div data-layout-area="top-end" />
      <div data-layout-area="middle-start" />
      <div data-layout-area="main" />
      <div data-layout-area="middle-end" />
      <div data-layout-area="bottom-start" />
      <div data-layout-area="bottom-center" />
      <div data-layout-area="bottom-end" />
      {children}
    </Root>
  );
};

Layout.TopStart = createLayoutAreaComponent('top-start');
Layout.TopCenter = createLayoutAreaComponent('top-center');
Layout.TopEnd = createLayoutAreaComponent('top-end');
Layout.MiddleStart = createLayoutAreaComponent('middle-start');
Layout.Main = createLayoutAreaComponent('main');
Layout.MiddleEnd = createLayoutAreaComponent('middle-end');
Layout.BottomStart = createLayoutAreaComponent('bottom-start');
Layout.BottomCenter = createLayoutAreaComponent('bottom-center');
Layout.BottomEnd = createLayoutAreaComponent('bottom-end');

Layout.defaultProps = {};

export default Layout;
