/**
 * Dependency imports
 */
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { Provider as SpeeduxProvider } from 'speedux';
import rtlPlugin from 'stylis-plugin-rtl';

/**
 * Local imports
 */
import '../styles/fonts.scss';
import GlobalStyles from '../styles/GlobalStyles';

/**
 * Init
 */
const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
});

/**
 * App
 */
export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const rtlMode = true;
  const direction = rtlMode ? 'rtl' : 'ltr';

  return (
    <>
      <Head>
        <title>New Tab - Ana Muslim</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpeeduxProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={rtlCache}
          theme={{
            /** Put your mantine theme override here */
            fontFamily: 'AnaMuslim-Tajawal',
            dir: direction,
          }}
        >
            <GlobalStyles />
            
            <div dir={direction}>
              <Component {...pageProps} />
            </div>
        </MantineProvider>
      </SpeeduxProvider>
    </>
  );
}
