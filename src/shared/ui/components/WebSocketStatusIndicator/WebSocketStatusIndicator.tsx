import { Badge, Spin, Tooltip } from 'antd';
import React from 'react';

import { WebSocketStatus } from '@/shared/api/useWebSocket';

import styles from './WebSocketStatusIndicator.module.scss';

const statusIndicator = {
  [WebSocketStatus.OPEN]: {
    text: 'Підключено',
    indicator: <Badge color="#89DB33" />,
  },
  [WebSocketStatus.CONNECTING]: {
    text: 'Підключення...',
    indicator: <Spin className={styles.webSocketStatusIndicator__spiner} size="small" />,
  },
  [WebSocketStatus.CLOSING]: {
    text: 'Закривається',
    indicator: <Badge color="#FF831A" />,
  },
  [WebSocketStatus.CLOSED]: {
    text: 'Відключено',
    indicator: <Badge color="#FF3800" />,
  },
  [WebSocketStatus.UNINSTANTIATED]: {
    text: 'Неініціалізовано',
    indicator: <Badge color="#959595" />,
  },
};

type WebSocketStatusIndicatorProps = {
  status: WebSocketStatus;
};

const WebSocketStatusIndicator: React.FC<WebSocketStatusIndicatorProps> = ({ status }) => {
  const statusInfo = statusIndicator[status];
  return (
    <div className={styles.webSocketStatusIndicator}>
      <Tooltip placement="top" title={statusInfo.text} arrow>
        <span>{statusInfo.indicator}</span>
      </Tooltip>
    </div>
  );
};

export default WebSocketStatusIndicator;
