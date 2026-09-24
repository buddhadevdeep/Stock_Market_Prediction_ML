import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="disclaimer-banner">
      <AlertTriangle size={16} />
      <span>
        <strong>Academic Disclaimer:</strong> Predictions are for educational purposes only and are not financial advice. Stock market predictions are non-deterministic.
      </span>
    </div>
  );
};
