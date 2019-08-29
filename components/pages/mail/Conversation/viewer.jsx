/* eslint-disable react/no-danger */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, Icon } from 'antd';
import DOMPurify from 'dompurify';

import EmailExtractor from '../../../../lib/email-extractor';
import parse from '../../../../lib/html-parser';
import { makeStyles } from '../../../../styles';
import custom from './styles.css';

const styles = makeStyles(custom);
const { Text } = Typography;

const Viewer = ({ payload, parse: parseMail }) => {
  const [content, setContent] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let didCancel = false;
    (async () => {
      const parsed = await parseMail(payload);
      if (!didCancel) {
        const extractor = new EmailExtractor(parsed);

        const _content = extractor.content.text.map((node) => {
          switch (node.type) {
            case 'text/html':
              return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parse(node.content, extractor)) }} />;

            case 'text/plain':
              return (
                <Text className={styles.plain}>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(node.content) }} />
                </Text>
              );

            default:
              throw new Error(`Content type ${node.type} is not supported.`);
          }
        });

        setContent(_content);
        setLoaded(true);
      }
    })();
    return () => { didCancel = true; };
  }, [parseMail, payload]);

  return (
    <div className={styles.use('p-2')}>

      {!loaded && <Icon type="loading" />}
      {loaded && content.length > 0 && content[content.length - 1]}
      {loaded && content.length === 0 && <Text disabled>No content</Text>}

      <Divider dashed />

      {/* TODO: display attachments here */}

    </div>
  );
};

Viewer.propTypes = {
  payload: PropTypes.string.isRequired,
  parse: PropTypes.func.isRequired,
};

export default Viewer;
