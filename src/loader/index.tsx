import React, { FunctionComponent } from 'react';
import styles from "./loader.module.scss";

const Loader: FunctionComponent = () => {
  return (
    <div className={styles.loaderWrapper}><div className={styles.loader}></div></div>
  );
};

export default Loader;