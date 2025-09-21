import React from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

const Spinner = ({ loading, size = 50, color = 'rgba(72,86,82,1)', className }) => {
  const overrideCss = css`
    display: block;
    margin: 0 auto;
    border-color: ${color};
  `;

  return (
    loading && (
      <div className={className}>
        <ClipLoader
          color={color}
          loading={loading}
          css={overrideCss}
          size={size}
        />
      </div>
    )
  );
};

export default Spinner;