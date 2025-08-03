'use client';

import Feedback from '@/features/feedback/components/Feedback/Feedback';
import SuppliersMap from '@/features/map/components/SuppliersMap/SuppliersMap';

import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  return (
    <div className={styles.homepage}>
      <SuppliersMap />
      <Feedback />
    </div>
  );
};
