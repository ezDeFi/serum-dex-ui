import React from 'react';
import { notification } from 'antd';
import Link from '../components/Link';

export function notify({
  message,
  description,
  isInstalled = true,
  txid,
  type = 'info',
  placement = 'bottomLeft',
}: {
  message: string;
  description?: string | JSX.Element;
  isInstalled?: boolean;
  txid?: string;
  type?: string;
  placement?: string;
}) {
  if (txid) {
    description = (
      <Link
        external
        to={'https://explorer.solana.com/tx/' + txid}
        style={{ color: '#0000ff' }}
      >
        View transaction {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
      </Link>
    );
  }
  if (!isInstalled) {
    description = (
      <Link
        external
        to={'https://ezdefi.com/download'}
        style={{ color: '#0000ff' }}
      >
        Click to install ezDeFi wallet
      </Link>
    );
  }
  notification[type]({
    message: <span style={{ color: 'black' }}>{message}</span>,
    description: (
      <span style={{ color: 'black', opacity: 0.5 }}>{description}</span>
    ),
    placement,
    style: {
      backgroundColor: 'white',
    },
  });
}
