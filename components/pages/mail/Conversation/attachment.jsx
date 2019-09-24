/* globals Blob, document */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const Attachment = ({ payload }) => {
  const { filename, content, type } = payload;

  const download = () => {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <React.Fragment>
      {!content && (
        <Button disabled type="danger" icon="download" className="mr-2">{filename}</Button>
      )}
      {content && (
        <Button type="primary" icon="download" className="mr-2" onClick={download}>
          {filename}
        </Button>
      )}
    </React.Fragment>
  );
};

Attachment.propTypes = {
  payload: PropTypes.shape({
    filename: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.object,
  }).isRequired,
};

Attachment.whyDidYouRender = true;

export default Attachment;
