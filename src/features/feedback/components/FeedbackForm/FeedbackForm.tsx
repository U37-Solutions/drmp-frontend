import { MailTwoTone } from '@ant-design/icons';
import { Button, Flex, Form, Input, Skeleton, Typography } from 'antd';
import React from 'react';

import { Feedback } from '@/features/feedback/types';

import styles from './FeedbackForm.module.scss';

type Props = {
  onSubmit: (values: Feedback) => Promise<void>;
  isLoading: boolean;
};

const FeedbackForm = ({ onSubmit, isLoading }: Props) => {
  const [form] = Form.useForm<Feedback>();

  const messageValue = Form.useWatch('message', form);

  return (
    <Form form={form} layout="vertical" requiredMark={false} className={styles.form} onFinish={onSubmit}>
      <Skeleton loading={isLoading}>
        <Form.Item
          label="Повідомлення"
          name="message"
          rules={[{ required: true, message: 'Будь ласка, введіть ваше повідомлення', type: 'string' }]}
        >
          <Input.TextArea rows={2} placeholder="Введіть ваше повідомлення тут..." />
        </Form.Item>

        {!!messageValue && (
          <>
            <Form.Item
              label="Як ми можемо до вас звертатися?"
              name="name"
              tooltip="Ваші особисті дані не будуть опубліковані. Вони можуть бути використані лише для зворотного звʼязку."
            >
              <Input type="text" placeholder="Імʼя (необовʼязково)" />
            </Form.Item>

            <Form.Item
              tooltip="Ми можемо звʼязатися з вами для уточнення деталей вашого відгуку"
              label="Електронна пошта"
              name="email"
              rules={[{ type: 'email', message: 'Неправильний формат електронної пошти' }]}
            >
              <Input type="email" placeholder="Введіть вашу електронну пошту (необовʼязково)" />
            </Form.Item>

            <Button type="primary" htmlType="submit" className={styles.submitButton}>
              Надіслати
            </Button>
          </>
        )}

        <Flex align="center" vertical>
          <Typography.Title level={4}>або</Typography.Title>
          <Typography>надішліть листа на нашу електронну пошту:</Typography>
          <Flex gap={4} align="center">
            <MailTwoTone />
            <a href="mailto:wvcc@gp.gov.ua">wvcc@gp.gov.ua</a>
          </Flex>
        </Flex>
      </Skeleton>
    </Form>
  );
};

export default FeedbackForm;
