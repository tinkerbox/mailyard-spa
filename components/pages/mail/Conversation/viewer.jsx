/* eslint-disable react/no-danger */

import { isEqual } from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, Icon } from 'antd';
import DOMPurify from 'dompurify';

import EmailExtractor from '../../../../lib/email-extractor';
import parse from '../../../../lib/html-parser';
import { makeStyles } from '../../../../styles';
import custom from './styles.css';
import Attachment from './attachment';

const styles = makeStyles(custom);
const { Text } = Typography;

const Viewer = ({ payload, parse: parseMail }) => {
  const [email, setEmail] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let didCancel = false;
    (async () => {
      if (email) return;
      const parsed = await parseMail(payload);

      if (!didCancel) {
        const extractor = new EmailExtractor(parsed);

        const content = extractor.content.text.map((node) => {
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

        const attachments = extractor.attachments.map(attachment => <Attachment key={attachment.filename} payload={attachment} />);

        const newEmail = { content, attachments };
        if (!isEqual(email, newEmail)) {
          setEmail(newEmail);
          setLoaded(true);
        }
      }
    })();
    return () => { didCancel = true; };
  }, [email, parseMail, payload]);

  return (
    <div className={styles.use('p-2')}>

      {!loaded && <Icon type="loading" />}
      {loaded && email.content.length > 0 && email.content[email.content.length - 1]}
      {loaded && email.content.length === 0 && <Text disabled>No content</Text>}

      {loaded && email.attachments.length > 0 && <Divider dashed orientation="left" className={styles.divider}>ATTACHMENTS</Divider>}
      {loaded && email.attachments}

    </div>
  );
};

Viewer.propTypes = {
  payload: PropTypes.string.isRequired,
  parse: PropTypes.func.isRequired,
};

Viewer.whyDidYouRender = true;

export default Viewer;
