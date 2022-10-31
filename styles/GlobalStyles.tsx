/**
 * Dependency imports
 */
import { Global, css } from '@emotion/react';

/**
 * Local imports
 */
import { baseFontSize } from '../utils/text';

/**
 * Component(s)
 */
const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        /* =================================== */
        /* BASE
        /* =================================== */

        *, *:before, *:after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          direction: rtl;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: AnaMuslim-Tajawal;
          font-weight: 500;
          font-size: ${baseFontSize}px;
        }
      `}
    />
  );
};

export default GlobalStyles;
