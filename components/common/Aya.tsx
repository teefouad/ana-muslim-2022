/**
 * Dependency imports
 */
import React from 'react';
import classnames from 'classnames';
import styled from '@emotion/styled';

/**
 * Local imports
 */
import Text from './Text';
import { toRem } from '../../utils/text';
import { toArabicDigits } from '../../utils/numbers';
import AyaSVG from '../../public/img/svgr/aya.svg';

/**
 * Root
 */
const Root = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: ${1.65 * 34 / 30}em;
  height: 1.65em;
  font-size: ${toRem(18)};

  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    line-height: 1;
    transform: translate(-50%, calc(-50% - ${toRem(1)}));
  }

  > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 100%;
    transform: translate(-50%, -50%);
  }
`;

/**
 * Aya Component
 */
interface Props {
  number: string,
}

const Aya: React.FC<Props & JSX.IntrinsicElements['div']> = ({
  number,
  ...props
}) => {
  return (
    <Root {...props} className={classnames('wb-aya', props.className)}>
      <Text type="ruqaa" inline>
        {
          number.split(/([:-])/g).map((v) => {
            if (v === ':' || v === '-') return v;
            return toArabicDigits(+v);
          })
        }
      </Text>

      <AyaSVG />
    </Root>
  );
};

Aya.defaultProps = {};

export default Aya;
