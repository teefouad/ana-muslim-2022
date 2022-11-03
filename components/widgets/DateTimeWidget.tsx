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
import Chameleon from '../common/Chameleon';
import Text from '../common/Text';
import Clock from '../common/Clock';
import Digits from '../common/Digits';
import { useCurrentDate } from '../../hooks/use-current-date';
import { useChameleon } from '../../hooks/use-chameleon';
import { toRem } from '../../utils/text';
import { toEnglishDigits } from '../../utils/numbers';
import ClockWidget from './ClockWidget';

/**
 * Constants
 */
const DECORATED_LABELS: { [label: string]: string } = {
  /* weekdays */
  'الجمعة': 'الجـمـعــــــــة',
  'السبت': 'السـبــــــــــــت',
  'الأحد': 'الأحـــــــــــــــــــد',
  'الاثنين': 'الاثــنــيـــــــــــن',
  'الثلاثاء': 'الثــــلاثــــــــــاء',
  'الأربعاء': 'الأربـــعــــــــاء',
  'الخميس': 'الخميــــــس',

  /* hijri months */
  'محرم': 'مـحــــــرم',
  'صفر': 'صـــفــــــر',
  'ربيع الأول': 'ربيـع الأول',
  'ربيع الآخر': 'ربيـع الآخـر',
  'جمادى الأولى': 'جمادى الأولى',
  'جمادى الآخرة': 'جمادى الآخرة',
  'رجب': 'رجــــــــــــب',
  'شعبان': 'شعبـان',
  'رمضان': 'رمضـان',
  'شوال': 'شــــــوال',
  'ذو القعدة': 'ذو القعدة',
  'ذو الحجة': 'ذو الحجـة',

  /* gregorian months */
  'يناير': 'ينـايـــــــر',
  'فبراير': 'فبـرايــر',
  'مارس': 'مــارس',
  'أبريل': 'أبـريـــــل',
  'مايو': 'مــايـــــــو',
  'يونيو': 'يـونـيــــو',
  'يوليو': 'يـولـيــــو',
  'أغسطس': 'أغسطس',
  'سبتمبر': 'سبتمبر',
  'أكتوبر': 'أكـتـوبـر',
  'نوفمبر': 'نوفمبر',
  'ديسمبر': 'ديسمبر',
};

/**
 * Root
 */
const Root = styled('section', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'layout',
    'textColor',
    'altTextColor',
    'month',
    'direction',
  ]).includes(prop.toString()),
})<Partial<DateTimeWidgetCombinedProps & { month: string, direction: string }>>((props) => {
  return css`
    color: ${props.textColor};
    user-select: none;
    direction: ${props.direction};
    animation: wb-date-time-widget-appear 400ms ease-out 400ms both;

    @keyframes wb-date-time-widget-appear {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    ${props.layout === '1' && css`
      display: flex;
      align-items: center;

      .wb-date-time-widget__time {
        order: 1;
        display: flex;
        align-items: center;
        height: 100%;
        padding-inline-start: ${toRem(20)};
        margin-inline-start: ${toRem(20)};
        border-inline-start: 1px dashed ${Color(props.textColor).alpha(0.4).string()};

        .wb-clock-widget {
          font-size: ${toRem(30)};
          font-weight: 300;
        }

        svg {
          path {
            stroke-width: 14;
          }
        }
      }

      .wb-date-time-widget__date {
        display: flex;
        align-items: center;
        position: relative;
        margin-inline-end: ${toRem(({
          'محرم': 48,
          'صفر': 48,
          'ربيع الأول': 70,
          'ربيع الآخر': 66,
          'جمادى الأولى': 89,
          'جمادى الآخرة': 88,
          'رجب': 52,
          'شعبان': 52,
          'رمضان': 52,
          'شوال': 53,
          'ذو القعدة': 68,
          'ذو الحجة': 62,
          
          'Muharram': 73,
          'Safar': 57,
          'Rabiʻ I': 57,
          'Rabiʻ II': 57,
          'Jumada I': 60,
          'Jumada II': 64,
          'Rajab': 57,
          'Shaʻban': 56,
          'Ramadan': 64,
          'Shawwal': 60,
          'Dhuʻl-Qiʻdah': 87,
          'Dhuʻl-Hijjah': 81,

          'يناير': 46,
          'فبراير': 46,
          'مارس': 46,
          'أبريل': 46,
          'مايو': 46,
          'يونيو': 46,
          'يوليو': 46,
          'أغسطس': 67,
          'سبتمبر': 50,
          'أكتوبر': 46,
          'نوفمبر': 46,
          'ديسمبر': 53,

          'January': 55,
          'February': 62,
          'March': 55,
          'April': 55,
          'May': 55,
          'June': 55,
          'July': 55,
          'August': 55,
          'September': 77,
          'October': 57,
          'November': 72,
          'December': 72,
        } as { [month: string]: number })[props.month!] + 15)}; /* 15 = month and year margin */
      }

      .wb-date-time-widget__weekday {
        margin-top: ${toRem(4)};
        padding-inline-end: ${toRem(20)};
        margin-inline-end: ${toRem(20)};
        border-inline-end: 1px dashed ${Color(props.textColor).alpha(0.4).string()};
        font-size: ${toRem(36)};
        font-weight: 300;
      }

      .wb-date-time-widget__day {
        margin-top: ${toRem(-8)};
        font-size: ${toRem(30)};

        svg {
          path {
            stroke-width: 14;
          }
        }
      }

      .wb-date-time-widget__month,
      .wb-date-time-widget__year {
        position: absolute;
        top: 50%;
        inset-inline-start: 100%;
        margin-inline-start: ${toRem(15)};
        font-size: ${toRem(16)};
        font-weight: 500;
        white-space: nowrap;
      }

      .wb-date-time-widget__month {
        margin-top: ${toRem(props.direction === 'rtl' ? -23 : -22)};
      }

      .wb-date-time-widget__year {
        margin-top: ${toRem(-2)};
      }
    `}

    ${props.layout === '2' && css`
      position: relative;

      &:before {
        content: '';
        display: block;
        height: ${toRem(50)};
        position: absolute;
        top: 100%;
        left: 50%;
        margin-top: ${toRem(-10)};
        border-right: 1px dashed ${Color(props.textColor).alpha(0.4).string()};
      }

      .wb-date-time-widget__time {
        position: absolute;
        top: 100%;
        inset-inline-end: ${toRem(30)};

        .wb-clock-widget {
          font-size: ${toRem(30)};
          font-weight: 300;
        }

        svg {
          path {
            stroke-width: 14;
          }
        }

        ${
          props.direction === 'rtl' && css`
            .wb-clock,
            .wb-clock__wrapper {
              transition: none; // fixes a weird flickering bug when language is Arabic
            }
          `
        }
      }

      .wb-date-time-widget__date {
        position: absolute;
        top: 100%;
        inset-inline-start: ${toRem(30)};
      }

      .wb-date-time-widget__weekday {
        position: absolute;
        margin-inline-start: ${toRem(-30)};
        margin-top: ${toRem(-20)};
        font-size: ${toRem(36)};
        font-weight: 300;
        transform: translate(${props.direction === 'rtl' ? '50%' : '-50%'}, -100%);
      }

      .wb-date-time-widget__day {
        margin-top: ${toRem(-12)};
        font-size: ${toRem(30)};

        svg {
          path {
            stroke-width: 14;
          }
        }
      }

      .wb-date-time-widget__month,
      .wb-date-time-widget__year {
        position: absolute;
        top: 50%;
        inset-inline-start: 100%;
        margin-inline-start: ${toRem(15)};
        font-size: ${toRem(16)};
        font-weight: 500;
        white-space: nowrap;
      }

      .wb-date-time-widget__month {
        margin-top: ${toRem(props.direction === 'rtl' ? -27 : -23)};
      }

      .wb-date-time-widget__year {
        margin-top: ${toRem(props.direction === 'rtl' ? -4 : -3)};
      }
    `}

    ${props.layout === '3' && css`
      position: relative;
      padding-top: ${toRem(90)};
      margin-top: -${toRem(20)};

      .wb-date-time-widget__time {
        position: absolute;
        top: 0;
        left: 50%;
        font-size: ${toRem(60)};
        transform: translateX(-50%);

        svg {
          path {
            stroke-width: 8;
          }
        }
      }

      .wb-date-time-widget__date {
        display: flex;
        padding: ${toRem(20)} ${toRem(30)} 0;
        font-size: ${toRem(16)};
        font-weight: normal;
        border-top: 1px dashed ${Color(props.textColor).alpha(0.4).string()};
        animation: wb-date-time-widget__date-appear-3 400ms ease-out 400ms both;

        @keyframes wb-date-time-widget__date-appear-3 {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      }

      .wb-date-time-widget__month {
        margin-inline-start: ${toRem(5)};
      }

      .wb-date-time-widget__day,
      .wb-date-time-widget__year {
        .wb-chameleon__wrapper {
          position: relative;
          margin-inline-start: ${toRem(12)};
          padding-inline-start: ${toRem(12)};

          &:before {
            content: '';
            display: block;
            width: ${toRem(4)};
            height: ${toRem(4)};
            border-radius: 50%;
            position: absolute;
            top: 50%;
            inset-inline-start: -${toRem(2)};
            margin-top: -${toRem(4)};
            background: ${Color(props.altTextColor).string()};
          }
        }
      }
    `}

    ${props.layout === '4' && css`
      position: absolute;

      .wb-date-time-widget__time {
        position: fixed;
        top: ${toRem(43)};
        inset-inline-end: ${toRem(40)};

        .wb-clock-widget {
          font-size: ${toRem(30)};
          font-weight: 300;
        }

        svg {
          path {
            stroke-width: 14;
          }
        }
      }

      .wb-date-time-widget__date {
        display: flex;
        position: fixed;
        top: ${toRem(30)};
        inset-inline-start: ${toRem(40)};
      }

      .wb-date-time-widget__weekday {
        margin-top: ${toRem(2)};
        margin-inline-end: ${toRem(15)};
        padding-inline-end: ${toRem(15)};
        border-inline-end: 1px dashed ${Color(props.textColor).alpha(0.4).string()};
        font-size: ${toRem(36)};
        font-weight: 300;
      }
      
      .wb-date-time-widget__day {
        font-size: ${toRem(30)};

        svg {
          path {
            stroke-width: 14;
          }
        }
      }

      .wb-date-time-widget__month,
      .wb-date-time-widget__year {
        position: absolute;
        top: 50%;
        inset-inline-start: 100%;
        margin-inline-start: ${toRem(15)};
        font-size: ${toRem(16)};
        font-weight: 500;
        white-space: nowrap;
      }

      .wb-date-time-widget__month {
        margin-top: ${toRem(props.direction === 'rtl' ? -24 : -22)};
      }

      .wb-date-time-widget__year {
        margin-top: ${toRem(props.direction === 'rtl' ? -3 : -2)};
      }
    `}
  `;
});

/**
 * DateTimeWidget Component
 */
export interface DateTimeWidgetProps {
  layout?: '1' | '2' | '3' | '4',
  timeMode?: '12' | '24',
  calendar?: 'hijri' | 'gregorian',
  lang?: 'ar' | 'en',
  textColor?: string,
  altTextColor?: string,
}

export type DateTimeWidgetCombinedProps = DateTimeWidgetProps & JSX.IntrinsicElements['section'];

const DateTimeWidget: React.FC<DateTimeWidgetCombinedProps> = ({
  layout,
  timeMode,
  calendar,
  lang,
  ...props
}) => {
  const date = useCurrentDate(calendar, lang);
  const [direction] = useChameleon(lang === 'ar' ? 'rtl' : 'ltr', [lang]);
  const [clockAlign] = useChameleon(layout === '2' ? 'center' : (lang === 'ar' ? 'start' : 'end'), [layout, lang]);
  const [month] = useChameleon(date.month, [calendar, lang]);

  return (
    <Root
      {...props}
      className={classnames('wb-date-time-widget', props.className)}
      layout={layout}
      direction={direction}
      month={month}
    >
      <Chameleon
        className="wb-date-time-widget__time"
        watch={[lang]}
      >
        <ClockWidget
          mode={timeMode!}
          align={clockAlign}
          periodScale={{
            1: 1.2,
            2: 1.2,
            3: 1,
            4: 1.2,
          }[layout ?? 1]}
        />
      </Chameleon>

      <div className="wb-date-time-widget__date">
        <Text className="wb-date-time-widget__weekday">
          <Chameleon watch={[calendar, lang]}>
            {
              layout === '4' ? (
                date.weekday
              ) : (
                DECORATED_LABELS[date.weekday] ?? date.weekday
              )
            }
          </Chameleon>
        </Text>

        <Text className="wb-date-time-widget__day">
          <Chameleon watch={[calendar, lang]}>
            {
              layout === '3' ? (
                toEnglishDigits(date.day)
              ) : (
                <Digits value={toEnglishDigits(date.day)} outDuration={0} />
              )
            }
          </Chameleon>
        </Text>

        <Text className="wb-date-time-widget__month">
          <Chameleon watch={[calendar, lang]}>
            {
              DECORATED_LABELS[date.month] ?? date.month
            }
          </Chameleon>
        </Text>

        <Text className="wb-date-time-widget__year">
          <Chameleon watch={[calendar, lang]}>
            {toEnglishDigits(date.year)} {date.era}
          </Chameleon>
        </Text>
      </div>
    </Root>
  );
};

DateTimeWidget.defaultProps = {
  layout: '1',
  timeMode: '12',
  calendar: 'hijri',
  lang: 'ar',
  textColor: '#fff',
  altTextColor: '#000',
};

export default DateTimeWidget;
