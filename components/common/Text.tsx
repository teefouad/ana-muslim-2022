/**
 * Dependency imports
 */
import React from 'react';
import classnames from 'classnames';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Local imports
 */
import { toRem } from '../../utils/text';

/**
 * Types
 */
export enum TextType {
  NORMAL = 'normal',
  NASKH = 'naskh',
  THULUTH = 'thuluth',
  RUQAA = 'ruqaa',
  LATIN = 'latin',
}

export enum TextSmoothing {
  NONE = 'none',
  AUTO = 'auto',
  SUBPIXEL = 'subpixel-antialiased',
  ANTIALIAS = 'antialiased',
}

/**
 * Root
 */
const Root = styled('div', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'type',
    'offset',
    'inline',
    'weight',
    'light',
    'bold',
    'smoothing',
  ]).includes(prop.toString()),
})<Partial<Props>>(({
  type,
  offset,
  inline,
  weight,
  light,
  bold,
  smoothing,
}) => css`
  > div {
    position: relative;
    display: ${inline ? 'inline-block' : 'block'};
    transform: translateY(${toRem(offset!)});
    font-weight: normal;
    -webkit-font-smoothing: ${smoothing};

    ${light && css`
      font-weight: 200;
    `}

    ${bold && css`
      font-weight: bold;
    `}

    ${weight && css`
      font-weight: ${weight};
    `}

    ${type === 'normal' && css`
      top: 0.125em;
      font-family: AnaMuslim-Tajawal;
    `}

    ${type === 'naskh' && css`
      top: 0.15em;
      font-family: AnaMuslim-Naskh;
      word-spacing: ${toRem(2)};
      font-feature-settings:
        "cswh",
        "ccmp",
        "liga",
        "rlig",
        "isol",
        "kern",
        "calt";
    `}

    ${type === 'thuluth' && css`
      top: 0.05em;
      font-family: AnaMuslim-Thuluth;
      font-feature-settings:
        "liga",
        "rlig",
        "clig",
        "calt";
    `}

    ${type === 'ruqaa' && css`
      top: 0.05em;
      font-family: AnaMuslim-Ruqaa;
    `}

    ${type === 'latin' && css`
      top: 0.05em;
      font-family: AnaMuslim-Merriweather;
    `}
  }
`);

/**
 * Text Component
 */
export interface Props {
  type?: Lowercase<keyof typeof TextType>,
  offset?: number,
  inline?: boolean,
  weight?: 200 | 300 | 400 | 500,
  light?: boolean,
  bold?: boolean,
  smoothing?: Lowercase<keyof typeof TextSmoothing>,
}

const Text: React.FC<Props & JSX.IntrinsicElements['div']> = ({
  children,
  ...props
}) => {
  return (
    <Root {...props} className={classnames('wb-text', props.className)}>
      <div className="wb-text__wrapper">
        {children}
      </div>
    </Root>
  );
};

Text.defaultProps = {
  type: TextType.NORMAL,
  offset: 0,
  inline: false,
  smoothing: 'subpixel',
};

export default Text;
