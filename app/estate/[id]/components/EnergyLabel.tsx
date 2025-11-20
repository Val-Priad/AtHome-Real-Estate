import React from "react";
import styles from "./EnergyLabel.module.css";

interface EnergyLabelProps {
  energyLabel: "A" | "B" | "C" | "D" | "E" | "F" | "G";
}

const EnergyLabel: React.FC<EnergyLabelProps> = ({ energyLabel }) => {
  const classMap: Record<string, string> = {
    A: styles.classA,
    B: styles.classB,
    C: styles.classC,
    D: styles.classD,
    E: styles.classE,
    F: styles.classF,
    G: styles.classG,
  };

  const labelClass = classMap[energyLabel];

  return (
    <div className={styles.energyLabel}>
      <div className={`${styles.qualityClass} ${labelClass}`}>
        {energyLabel}
      </div>
    </div>
  );
};

export default EnergyLabel;
