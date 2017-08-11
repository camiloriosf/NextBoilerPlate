import React from 'react';
import { translate } from 'react-i18next';
import { createStyleSheet } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';

const styleSheet = createStyleSheet('Main', {
  root: {
    width: '100%',
  },
});

function Main(props) {
  return (
    <Typography type="title">
      {props.t('main.title')}
    </Typography>
  );
}

export default translate(['common'])(withStyles(styleSheet)(Main));
