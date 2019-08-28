/* eslint-disable react/no-danger */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Typography, Divider, Icon } from 'antd';
import DOMPurify from 'dompurify';

import EmailExtractor from '../../../../lib/email-extractor';
import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);

const { Text } = Typography;

const Viewer = ({ payload, parse }) => {
  const [email, setEmail] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let didCancel = false;
    (async () => {
      const parsed = await parse(payload);
      const extractor = new EmailExtractor(parsed);
      if (!didCancel) {
        setEmail(extractor.content());
        setLoaded(true);
      }
    })();
    return () => { didCancel = true; };
  }, [parse, payload]);

  const htmlContent = email && email['text/html'] ? email['text/html'][0].content : null;
  const textContent = email && email['text/plain'] ? email['text/plain'][0].content : null;

  return (
    <div className={styles.use('p-2')}>

      {loaded && htmlContent && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />}

      {loaded && !htmlContent && textContent && (
        <Text className={styles.plain}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(textContent) }} />
        </Text>
      )}

      {loaded && !htmlContent && !textContent && <Text disabled>No content</Text>}
      {!loaded && <Icon type="loading" />}

      <Divider dashed />

    </div>
  );
};

Viewer.propTypes = {
  payload: PropTypes.string.isRequired,
  parse: PropTypes.func.isRequired,
};

export default Viewer;
