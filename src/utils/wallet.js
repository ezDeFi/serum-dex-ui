import React, { useContext, useEffect, useMemo, useState } from 'react';
import Wallet from '@project-serum/sol-wallet-adapter';
import EzWallet from '@ezdefi/ez-sol-wallet-adapter';
import { notify } from './notifications';
import { useConnectionConfig } from './connection';
import { useLocalStorageState } from './utils';

export const WALLET_PROVIDERS = [
  { name: 'sollet.io', url: 'https://www.sollet.io' },
  { name: 'ezDeFi', url: 'https://ezdefi.com/wallet' },
];

const EZDEFI_INSTALL = 'https://ezdefi.com/download';

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
  const { endpoint } = useConnectionConfig();

  const [providerUrl, setProviderUrl] = useLocalStorageState(
    'walletProvider',
    'https://www.sollet.io',
  );

  let wallet = useMemo(() => new Wallet(providerUrl, endpoint), [
    providerUrl,
    endpoint,
  ]);
  const [ezWallet] = useState(new EzWallet());
  if (providerUrl === 'https://ezdefi.com/wallet') {
    wallet = ezWallet;
  }

  const [connected, setConnected] = useState(false);
  const [cluster, setCluster] = useState(false);

  useEffect(() => {
    console.log('trying to connect');
    if (typeof wallet.isInjected === 'function' && !wallet.isInjected()) {
      notify({
        message: 'Error',
        needInstall: EZDEFI_INSTALL,
      });
      setProviderUrl('https://www.sollet.io');
      return;
    }
    wallet.on('connect', () => {
      if (!wallet.publicKey) {
        setConnected(false);
        notify({
          message: 'Connection failed.',
          description: 'Please select SOL account.',
        });
        return;
      }
      console.log('connected');
      setConnected(true);
      let walletPublicKey = wallet.publicKey.toBase58();
      let keyToDisplay =
        walletPublicKey.length > 20
          ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
              walletPublicKey.length - 7,
              walletPublicKey.length,
            )}`
          : walletPublicKey;
      notify({
        message: 'Wallet update',
        description: 'Connected to wallet ' + keyToDisplay,
      });
      wallet
        ._sendRequest('wallet_getCluster')
        .then((cluster) => setCluster(cluster));
    });
    wallet.on('disconnect', () => {
      setConnected(false);
      notify({
        message: 'Wallet update',
        description: 'Disconnected from wallet',
      });
    });
    return () => {
      wallet.disconnect();
      setConnected(false);
    };
  }, [wallet, ezWallet, setProviderUrl]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        providerUrl,
        setProviderUrl,
        cluster,
        providerName:
          WALLET_PROVIDERS.find(({ url }) => url === providerUrl)?.name ??
          providerUrl,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  return {
    connected: context.connected,
    wallet: context.wallet,
    providerUrl: context.providerUrl,
    setProvider: context.setProviderUrl,
    cluster: context.cluster,
    providerName: context.providerName,
  };
}
