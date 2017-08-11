import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import App from '../components/App';
import Main from '../components/Main';

const styles = {
  root: {
    flexGrow: 1,
  },
};

export default () => (
  <App>
    <I18nextProvider i18n={i18n}>
      <div style={styles.root}>
        <Main />
      </div>
    </I18nextProvider>
  </App>
);
