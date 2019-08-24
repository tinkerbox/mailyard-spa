/* eslint-disable react/no-danger */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Typography, Divider } from 'antd';
import DOMPurify from 'dompurify';

import { useEmailParser } from '../../../../hooks/email-parser';
import EmailExtractor from '../../../../lib/email-extractor';
import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);

const { Text } = Typography;

const Viewer = ({ payload }) => {
  const [email, setEmail] = useState();
  const { parse } = useEmailParser();

  useEffect(() => {
    let didCancel = false;
    (async () => {
      const parsed = await parse(payload);
      const extractor = new EmailExtractor(parsed);
      if (!didCancel) setEmail(extractor.content());
    })();
    return () => { didCancel = true; };
  }, [parse, payload]);

  const htmlContent = email && email['text/html'] ? email['text/html'][0].content : null;
  const textContent = email && email['text/plain'] ? email['text/plain'][0].content : null;

  return (
    <div className={styles.use('p-2')}>
      {htmlContent && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />}
      {!htmlContent && textContent && (
        <Text className={styles.plain}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(textContent) }} />
        </Text>
      )}
      <Divider dashed />
    </div>
  );
};

Viewer.propTypes = {
  payload: PropTypes.string.isRequired,
};

export default Viewer;
