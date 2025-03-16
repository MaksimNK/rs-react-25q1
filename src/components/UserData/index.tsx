import React from 'react';
import * as PropTypes from 'prop-types';

type UserDataProps = {
  title: string;
  data: {
    name: string;
    age: number;
    email: string;
    gender: 'male' | 'female' | 'other';
    country: string;
    acceptTerms: boolean;
    picture?: string;
  };
  isNew?: boolean;
};

export const UserData: React.FC<UserDataProps> = ({ title, data, isNew }) => {
  return (
    <div className={`user-data-tile ${isNew ? 'new-data' : ''}`}>
      <h3>{title}</h3>
      <div className="tile-content">
        <div className="data-row">
          <span className="data-label">Name:</span>
          <span className="data-value">{data.name}</span>
        </div>
        <div className="data-row">
          <span className="data-label">Age:</span>
          <span className="data-value">{data.age}</span>
        </div>
        <div className="data-row">
          <span className="data-label">Email:</span>
          <span className="data-value">{data.email}</span>
        </div>
        <div className="data-row">
          <span className="data-label">Gender:</span>
          <span className="data-value">{data.gender}</span>
        </div>
        <div className="data-row">
          <span className="data-label">Country:</span>
          <span className="data-value">{data.country}</span>
        </div>
        <div className="data-row">
          <span className="data-label">Terms accepted:</span>
          <span className="data-value">{data.acceptTerms ? 'Yes' : 'No'}</span>
        </div>
        {data.picture && (
          <div className="picture-preview">
            <span className="data-label">Picture:</span>
            <img
              src={data.picture}
              alt="User uploaded"
              className="user-picture"
            />
          </div>
        )}
      </div>
    </div>
  );
};

UserData.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    gender: PropTypes.oneOf(['male', 'female', 'other']).isRequired,
    country: PropTypes.string.isRequired,
    acceptTerms: PropTypes.bool.isRequired,
    picture: PropTypes.string,
  }).isRequired,
  isNew: PropTypes.bool,
};
