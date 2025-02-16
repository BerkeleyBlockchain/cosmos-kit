/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetList, Chain } from '@chain-registry/types';
import {
  ChainWalletData,
  EndpointOptions,
  MainWalletBase,
  ModalVersion,
  SessionOptions,
  SignerOptions,
  WalletManagerV2,
  WalletModalPropsV2,
  WalletRepo,
} from '@cosmos-kit/core';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DefaultModalV2 } from '.';
import { getModalV2 } from './modal';

export const walletContextV2 = createContext<{
  walletManager: WalletManagerV2;
  // deps: State[];
} | null>(null);

export const ChainProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal,
  modalTheme,
  signerOptions,
  // viewOptions,
  endpointOptions,
  sessionOptions,
  children,
}: {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: MainWalletBase[];
  walletModal?: ModalVersion | ((props: WalletModalPropsV2) => JSX.Element);
  modalTheme?: Record<string, any>;
  signerOptions?: SignerOptions;
  // viewOptions?: ViewOptions;
  endpointOptions?: EndpointOptions;
  sessionOptions?: SessionOptions;
  children: ReactNode;
}) => {
  const walletManager = useMemo(
    () =>
      new WalletManagerV2(
        chains,
        assetLists,
        wallets,
        signerOptions,
        endpointOptions,
        sessionOptions
      ),
    []
  );

  // const deps = [];

  const [isViewOpen, setViewOpen] = useState<boolean>(false);
  const [viewWalletRepo, setViewWalletRepo] = useState<
    WalletRepo | undefined
  >();

  walletManager.walletRepos.forEach((wr) => {
    const [, setData] = useState<ChainWalletData>();
    const [state, setState] = useState(wr.state);
    const [msg, setMsg] = useState<string | undefined>();

    wr.setActions({
      viewOpen: setViewOpen,
      viewWalletRepo: setViewWalletRepo,
    });
    wr.wallets.forEach((w) => {
      w.setActions({
        data: setData,
        state: setState,
        message: setMsg,
      });
    });
    // deps.push(state, msg);
  });

  const Modal = useMemo(() => {
    if (!walletModal) {
      return DefaultModalV2;
    } else if (typeof walletModal === 'string') {
      return getModalV2(walletModal as ModalVersion);
    } else {
      return walletModal;
    }
  }, [walletModal]);

  useEffect(() => {
    walletManager.onMounted();
    return () => {
      walletManager.onUnmounted();
    };
  }, []);

  return (
    <walletContextV2.Provider
      value={{
        walletManager,
        // deps,
      }}
    >
      {children}
      <Modal
        isOpen={isViewOpen}
        setOpen={setViewOpen}
        walletRepo={viewWalletRepo}
        theme={modalTheme}
      />
    </walletContextV2.Provider>
  );
};
