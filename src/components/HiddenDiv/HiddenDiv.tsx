import React from "react";
import styles from "./HiddenDiv.module.css";

export interface HiddenDivProps {
  children: any
}

const HiddenDiv: React.FC<HiddenDivProps> = ({children}: HiddenDivProps) => (
  <div className={styles.hidden}>
    {children}
  </div>
)

export default HiddenDiv
