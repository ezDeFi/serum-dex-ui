import React from 'react';
import { notification } from 'antd';
import Link from '../components/Link';

export function notify({
  message,
  description,
  txid,
  type = 'info',
  placement = 'bottomLeft',
  needInstall,
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
  if (needInstall) {
    description = (
      <div>
        <div>EzDefi not initialized.</div>
        <span>Install </span>
        <span>
          <Link
            external
            to={
              'https://chrome.google.com/webstore/detail/ezdefi/bangadcapihadohjgdihpcpmjlepokld'
            }
            style={{ color: '#FF0000', fontWeight: 'bold' }}
          >
            EzDefi Extension
          </Link>
        </span>
        <span> and reload page.</span>
      </div>
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
