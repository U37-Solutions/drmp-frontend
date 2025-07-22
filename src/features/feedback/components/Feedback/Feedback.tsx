'use client';
import { Alert, Card, Flex, Typography } from 'antd';
import React from 'react';

import { sendFeedback } from '@/features/feedback/api';
import FeedbackForm from '@/features/feedback/components/FeedbackForm/FeedbackForm';
import type { Feedback } from '@/features/feedback/types';

import styles from './Feedback.module.scss';

const STATUS_SUCCESS = 200;

const Feedback = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isFeedbackSent, setIsFeedbackSent] = React.useState(false);

  const handleSubmit = async (values: Feedback) => {
    setError(null);
    setIsLoading(true);
    await sendFeedback(values)
      .then((res) => {
        setIsFeedbackSent(res.status === STATUS_SUCCESS);
      })
      .catch(() => {
        setError('Не вдалося надіслати відгук. Будь ласка, спробуйте ще раз.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card rootClassName={styles.card} classNames={{ body: styles.cardBody }}>
      {isFeedbackSent && !error ? (
        <div className={styles.successMessage}>
          <Typography.Title level={3}>Ваш відгук був успішно надісланий!</Typography.Title>
          <Typography.Text>Ми дуже вдячні за ваш внесок у покращення платформи.</Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ marginBottom: 0 }}>
            Якщо ви залишали дані для зворотного звʼязку, наш менеджер може звʼязатися із вами для детальнішого
            обговорення.
          </Typography.Text>
        </div>
      ) : (
        <Flex vertical gap={12}>
          <Flex vertical gap={12}>
            <div>
              <Typography.Title level={3}>Зворотний звʼязок</Typography.Title>
              <Typography.Text type="secondary">
                Ваш відгук допомагає нам покращувати платформу. Ви можете повідомити про помилку, запропонувати
                покращення або поділитися своїм досвідом користування.
              </Typography.Text>
            </div>

            {error && <Alert showIcon type="error" message={error} />}
          </Flex>

          <FeedbackForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Flex>
      )}
    </Card>
  );
};

export default Feedback;
