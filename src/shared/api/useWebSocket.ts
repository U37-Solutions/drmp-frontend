import { useCallback, useMemo, useState } from 'react';
import useReactWebSocket, { ReadyState } from 'react-use-websocket';

import { environments } from '@/shared/configs/environments';

export enum WebSocketStatus {
  CONNECTING = 'connecting',
  OPEN = 'open',
  CLOSING = 'closing',
  CLOSED = 'closed',
  UNINSTANTIATED = 'uninstantiated',
}

type WebSocketOptions = {
  share?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number | ((attempt: number) => number);
  connectOnSend?: boolean;
};

type WebSocketProps = {
  url: string;
  options?: WebSocketOptions;
};

export const useWebSocket = ({ url, options = {} }: WebSocketProps) => {
  const [shouldConnect, setShouldConnect] = useState(!options.connectOnSend);

  const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket } = useReactWebSocket(
    `${environments.wsUrl}${url}`,
    {
      share: options.share ?? false,
      shouldReconnect: () => true,
      reconnectAttempts: options.reconnectAttempts,
      reconnectInterval: options.reconnectInterval,
      // TODO: Implement custom handlers if needed
      // onOpen: () => console.log('[WS] Connection opened'),
      // onClose: () => console.log('[WS] Connection closed'),
      // onError: (event) => console.error('[WS] Error', event),
      // onMessage: (event) => console.debug('[WS] Message', event.data),
    },
    shouldConnect,
  );

  const initiateConnection = useCallback(() => setShouldConnect(true), []);

  // Convert readyState number to human-readable status
  const status = useMemo<WebSocketStatus>(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return WebSocketStatus.CONNECTING;
      case ReadyState.OPEN:
        return WebSocketStatus.OPEN;
      case ReadyState.CLOSING:
        return WebSocketStatus.CLOSING;
      case ReadyState.CLOSED:
      case ReadyState.UNINSTANTIATED:
      default:
        return WebSocketStatus.CLOSED;
    }
  }, [readyState]);

  const closeWebSocket = useCallback(() => {
    const ws = getWebSocket();
    ws?.close();
  }, [getWebSocket]);

  return {
    status,
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    closeWebSocket,
    rawWebSocket: getWebSocket(),
    initiateConnection,
  };
};
