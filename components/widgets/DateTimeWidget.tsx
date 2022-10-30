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
import Digits, { getDigitsSizeInEm } from '../common/Digits';
import { useCurrentDate } from '../../hooks/use-current-date';
import { useChameleon } from '../../hooks/use-chameleon';
import { toRem } from '../../utils/text';
import { toEnglishDigits } from '../../utils/numbers';

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
  'ربيع الأول': 'ربـيـــــع الأول',
  'ربيع الآخر': 'ربـيـــــع الآخــر',
  'جمادى الأولى': 'جـمـــادى الأولــى',
  'جمادى الآخرة': 'جـمـــادى الآخـــرة',
  'رجب': 'رجــــــــــــب',
  'شعبان': 'شعبـــان',
  'رمضان': 'رمضـــان',
  'شوال': 'شــــــوال',
  'ذو القعدة': 'ذو القـعــــدة',
  'ذو الحجة': 'ذو الحـجــــة',

  /* gregorian months */
  'يناير': 'ينـــايــــــر',
  'فبراير': 'فبــرايـــر',
  'مارس': 'مــــارس',
  'أبريل': 'أبـــريــــــل',
  'مايو': 'مـــايـــــــو',
  'يونيو': 'يـونـيــــــو',
  'يوليو': 'يـولـيـــــو',
  'أغسطس': 'أغسطـس',
  'سبتمبر': 'سبتـمـبــر',
  'أكتوبر': 'أكـتـوبــر',
  'نوفمبر': 'نوفمبــر',
  'ديسمبر': 'ديسمبــر',
};

/**
 * Root
 */
const Root = styled('section', {
  shouldForwardProp: (prop: PropertyKey) => !([
    'layout',
    'textColor',
    'altTextColor',
    'backgroundColor',
    'opacity',
    'blurAmount',
    'day',
    'weekday',
    'direction',
  ]).includes(prop.toString()),
})<Partial<DateTimeWidgetCombinedProps & { day: number, weekday: string, direction: string }>>((props) => {
  const weekdayWidths: { [n: string]: number } = {
    الجمعة: 186,
    السبت: 190,
    الأحد: 184,
    الاثنين: 186,
    الثلاثاء: 185,
    الأربعاء: 184,
    الخميس: 187,
    friday: 129,
    saturday: 166,
    sunday: 143,
    monday: 153,
    tuesday: 156,
    wednesday: 206,
    thursday: 171,
  };

  const weekdayWidth = weekdayWidths[props.weekday?.replace(/ـ/g, '').toLowerCase()!];

  return css`
    color: ${props.textColor};
    user-select: none;
    direction: ${props.direction};

    ${props.layout === '1' && css`
      transform: translateX(${toRem(props.direction === 'rtl' ? -15 : 15)});
      animation: wb-date-time-widget-appear-1 400ms ease-out 400ms both;

      @keyframes wb-date-time-widget-appear-1 {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .wb-date-time-widget__weekday {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: ${toRem(5)} ${toRem(20)} 0;
        transform: translate(-50%, -48%);
        font-size: ${toRem(36)};
        font-weight: 200;

        .wb-chameleon__wrapper {
          &:before {
            content: '';
            position: absolute;
            top: -${toRem(5)};
            bottom: ${toRem(7)};
            right: -${toRem(20)};
            left: -${toRem(20)};
            border: 1px dashed ${Color(props.textColor).alpha(0.4).string()};
            border-top: none;
            border-bottom: none;
          }
        }
      }

      .wb-date-time-widget__time {
        position: absolute;
        top: 50%;
        inset-inline-end: 100%;
        margin-inline-end: ${toRem(20 + (weekdayWidth / 2))};
        transform: translateY(-47%);

        .wb-clock {
          font-size: ${toRem(42)};
        }

        svg {
          path {
            stroke-width: 10;
          }
        }
      }

      .wb-date-time-widget__day {
        position: absolute;
        top: 50%;
        inset-inline-start: 100%;
        margin-inline-start: ${toRem(20 + (weekdayWidth / 2))};
        transform: translateY(-45%);
        font-size: ${toRem(42)};

        svg {
          path {
            stroke-width: 10;
          }
        }
      }

      .wb-date-time-widget__month,
      .wb-date-time-widget__year {
        position: absolute;
        top: 50%;
        inset-inline-start: calc(100% + ${getDigitsSizeInEm(toEnglishDigits(props.day!), 42)}em);
        margin-inline-start: ${toRem(40 + (weekdayWidth / 2))};
        transform: translateY(-50%);
        font-size: ${toRem(16)};
        font-weight: normal;
        white-space: nowrap;
      }

      .wb-date-time-widget__month {
        margin-top: -${toRem(7)};
      }

      .wb-date-time-widget__year {
        margin-top: ${toRem(11)};
      }
    `}

    ${props.layout === '2' && css`
      position: relative;
      padding-top: ${toRem(120)};
      margin-top: -${toRem(20)};

      .wb-date-time-widget__time {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);

        svg {
          path {
            stroke-width: 5;
          }
        }
      }

      .wb-date-time-widget__date {
        display: flex;
        padding: ${toRem(20)} ${toRem(20)} 0;
        font-size: ${toRem(16)};
        font-weight: normal;
        border-top: 1px dashed ${Color(props.textColor).alpha(0.4).string()};
        animation: wb-date-time-widget__date-appear-2 400ms ease-out 400ms both;

        @keyframes wb-date-time-widget__date-appear-2 {
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
  `;
});

/**
 * DateTimeWidget Component
 */
export interface DateTimeWidgetProps {
  layout?: '1' | '2' | '3',
  timeMode?: '12' | '24',
  calendar?: 'hijri' | 'gregorian',
  lang?: 'ar' | 'en',
  textColor?: string,
  altTextColor?: string,
  backgroundColor?: string,
  opacity?: number,
  blurAmount?: number,
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
  const [weekday] = useChameleon(date.weekday, [calendar, lang]);

  return (
    <Root
      {...props}
      className={classnames('wb-date-time-widget', props.className)}
      layout={layout}
      direction={direction}
      day={date.day}
      weekday={weekday}
    >
      <Chameleon
        className="wb-date-time-widget__time"
        watch={[lang]}
      >
        <Clock
          mode={timeMode!}
          align={clockAlign}
          periodSize={layout === '1' ? 2 : 1}
        />
      </Chameleon>

      <div className="wb-date-time-widget__date">
        <Text className="wb-date-time-widget__weekday">
          <Chameleon watch={[calendar, lang]}>
            {DECORATED_LABELS[date.weekday] ?? date.weekday}
          </Chameleon>
        </Text>

        <Text className="wb-date-time-widget__day">
          <Chameleon watch={[calendar, lang]}>
            {
              layout === '1' ? (
                <Digits value={toEnglishDigits(date.day)} />
              ) : (
                toEnglishDigits(date.day)
              )
            }
          </Chameleon>
        </Text>

        <Text className="wb-date-time-widget__month">
          <Chameleon watch={[calendar, lang]}>
            {DECORATED_LABELS[date.month] ?? date.month}
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
  backgroundColor: '#000',
  opacity: 0.4,
  blurAmount: 4,
};

export default DateTimeWidget;
