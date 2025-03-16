import { FC } from 'react';
interface IPasswordStrengthMeterProps {
  strength: number;
}

export const PasswordStrengthMeter: FC<IPasswordStrengthMeterProps> = ({
  strength,
}) => {
  const getLabel = () => {
    switch (strength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Medium';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (strength) {
      case 0:
        return '#ff4d4d';
      case 1:
        return '#ff9933';
      case 2:
        return '#ffcc00';
      case 3:
        return '#00cc44';
      case 4:
        return '#009933';
      default:
        return '#dddddd';
    }
  };

  const filledSegments = strength > 0 ? strength : 0;

  return (
    <div className="password-strength-meter">
      <div className="strength-meter">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`meter-segment ${index < filledSegments ? 'filled' : ''}`}
            style={{
              backgroundColor: index < filledSegments ? getColor() : undefined,
            }}
          />
        ))}
      </div>
      <div className="strength-label" style={{ color: getColor() }}>
        {getLabel()}
      </div>
    </div>
  );
};
