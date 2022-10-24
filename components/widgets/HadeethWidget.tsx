/**
 * Dependency imports
 */
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import classnames from 'classnames';
import Color from 'color';

/**
 * Local imports
 */
import Text from '../common/Text';
import StackedDiacritics from '../common/StackedDiacritics';
import { toRem, removeDiacritics } from '../../utils/text';

/**
 * Root
 */
const Root = styled('section', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'textColor',
    'altTextColor',
    'backgroundColor',
    'opacity',
    'blurAmount',
    'contentLength',
  ]).includes(prop.toString()),
})<Partial<Props & { contentLength: number }>>(({
  textColor,
  altTextColor,
  backgroundColor,
  opacity,
  blurAmount,
  contentLength,
}) => css`
  width: 60vw;
  padding: ${toRem(30)};
  text-align: center;
  background: ${typeof opacity !== 'undefined' ? Color(backgroundColor).alpha(opacity).string() : backgroundColor};
  border-radius: ${toRem(15)};
  backdrop-filter: blur(${toRem(blurAmount ?? 10)});
  animation: hadeeth-widget-appear 400ms ease-out 400ms both;

  @keyframes hadeeth-widget-appear {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .wb-hadeeth-widget__head {
    margin: 0 0 ${toRem(15)} 0;
    font-size: ${toRem(20)};
    font-weight: 300;
    line-height: 1.5;
    color: ${altTextColor};

    *::selection {
      background-color: ${Color(altTextColor ?? '#000').fade(0.7).string()};
    }
  }

  .wb-hadeeth-widget__content {
    margin: ${toRem(5)} 0;
    font-size: ${toRem(30 * Math.min(1, Math.max(0.75, 250 / contentLength!)))};
    word-spacing: 0.05em;
    /* text-shadow: 0 1px rgba(0, 0, 0, 0.05); */
    color: ${textColor};

    .wb-diacritics {
      opacity: 0.5;
      color: ${altTextColor};
    }

    *::selection {
      background-color: ${Color(textColor).fade(0.7).string()};
    }
  }

  .wb-hadeeth-widget__tail {
    display: block;
    margin: ${toRem(15)} 0 0;
    font-size: ${toRem(20)};
    font-weight: 300;
    line-height: 1.5;
    color: ${altTextColor};

    *::selection {
      background-color: ${Color(altTextColor).fade(0.7).string()};
    }
  }
`);

/**
 * HadeethWidget Component
 */
export interface Props {
  head?: string,
  content: string,
  tail?: string,
  textColor?: string,
  altTextColor?: string,
  backgroundColor?: string,
  opacity?: number,
  blurAmount?: number,
}

const HadeethWidget: React.FC<Props & JSX.IntrinsicElements['section']> = ({
  head,
  content,
  tail,
  ...props
}) => {
  return (
    <Root
      {...props}
      className={classnames('wb-hadeeth-widget-container wb-hadeeth-widget-container--hadeeth', props.className)}
      contentLength={removeDiacritics(content).length}
    >
      {
        head && (
          <div className="wb-hadeeth-widget__head">
            <Text type="ruqaa">
              {removeDiacritics(head)}
            </Text>
          </div>
        )
      }

      <div className="wb-hadeeth-widget__content">
        <StackedDiacritics
          type="ruqaa"
          text={content}
        />
      </div>

      {
        tail && (
          <div className="wb-hadeeth-widget__tail">
            <Text type="ruqaa">
              {removeDiacritics(tail)}
            </Text>
          </div>
        )
      }
    </Root>
  );
};

HadeethWidget.defaultProps = {
  head: '',
  tail: '',
  textColor: '#fff',
  altTextColor: '#000',
  backgroundColor: '#000',
  opacity: 0.3,
  blurAmount: 15,
};

export default HadeethWidget;
