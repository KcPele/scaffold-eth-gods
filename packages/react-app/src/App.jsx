import { useContractReader } from 'eth-hooks';

import React, { Fragment, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import {
  Account,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
} from './components';
import { NETWORKS } from './constants';

import { classNames } from './helpers';
import { Home, ExampleUI, Hints, Subgraph } from './views';

import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  MenuAlt2Icon,
  XIcon,
  CodeIcon,
  TemplateIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ShareIcon,
} from '@heroicons/react/outline';
import { useStateContext } from './context/StateContext';

const { ethers } = require('ethers');
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

function App(props) {
  const {
    NETWORKCHECK,
    USE_BURNER_WALLET,
    USE_NETWORK_SELECTOR,
    web3Modal,
    networkOptions,
    logoutOfWeb3Modal,
    userSigner,
    gasPrice,
    price,
    address,
    mainnetProvider,
    mainnetContracts,
    writeContracts,
    readContracts,
    loadWeb3Modal,
    faucetAvailable,
    contractConfig,
    tx,
    yourLocalBalance,
    blockExplorer,
    localChainId,
    localProvider,
    selectedChainId,

    selectedNetwork,
    setSelectedNetwork,
    targetNetwork,
  } = useStateContext();
  const location = useLocation();
  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, 'YourContract', 'purpose');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Debug Contracts', href: '/debug', icon: CodeIcon },
    { name: 'Hints', href: '/hints', icon: SparklesIcon },
    { name: 'ExampleUI', href: '/exampleui', icon: TemplateIcon },
    { name: 'Mainnet DAI', href: '/mainnetdai', icon: CurrencyDollarIcon },
    { name: 'Subgraph', href: '/subgraph', icon: ShareIcon },
  ];

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-gray-900"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white dark:text-gray-900" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <Header />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map(item => {
                      const current = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            current
                              ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                          )}
                        >
                          <item.icon
                            className={classNames(
                              current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 flex-shrink-0 h-6 w-6',
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex p-4">
                  <ThemeSwitch />
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 pt-5 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Header />
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map(item => {
                  const current = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        current
                          ? 'bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      )}
                    >
                      <item.icon
                        className={classNames(
                          current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6',
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex p-4">
              <ThemeSwitch />
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top nav */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700">
            <button
              type="button"
              className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex flex-row justify-end">
              {USE_NETWORK_SELECTOR && (
                <NetworkSwitch
                  networkOptions={networkOptions}
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              )}
              <Account
                useBurner={USE_BURNER_WALLET}
                address={address}
                localProvider={localProvider}
                userSigner={userSigner}
                mainnetProvider={mainnetProvider}
                price={price}
                web3Modal={web3Modal}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
                blockExplorer={blockExplorer}
              />
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Routes>
                  {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
                  <Route
                    exact
                    path="/"
                    element={<Home yourLocalBalance={yourLocalBalance} readContracts={readContracts} />}
                  />

                  {/*
                      🎛 this scaffolding is full of commonly used components
                      this <Contract/> component will automatically parse your ABI
                      and give you a form to interact with it locally
                  */}
                  <Route
                    exact
                    path="/debug"
                    element={
                      <Contract
                        name="AVAXGods"
                        price={price}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                      />
                    }
                  />

                  <Route
                    path="/hints"
                    element={
                      <Hints
                        address={address}
                        yourLocalBalance={yourLocalBalance}
                        mainnetProvider={mainnetProvider}
                        price={price}
                      />
                    }
                  />

                  <Route
                    path="/exampleui"
                    element={
                      <ExampleUI
                        address={address}
                        userSigner={userSigner}
                        mainnetProvider={mainnetProvider}
                        localProvider={localProvider}
                        yourLocalBalance={yourLocalBalance}
                        price={price}
                        tx={tx}
                        writeContracts={writeContracts}
                        readContracts={readContracts}
                        purpose={purpose}
                      />
                    }
                  />

                  <Route
                    path="/mainnetdai"
                    element={
                      <>
                        <Contract
                          name="DAI"
                          customContract={
                            mainnetContracts && mainnetContracts.contracts && mainnetContracts.contracts.DAI
                          }
                          signer={userSigner}
                          provider={mainnetProvider}
                          address={address}
                          blockExplorer="https://etherscan.io/"
                          contractConfig={contractConfig}
                          chainId={1}
                        />
                        {/*
                      <Contract
                        name="UNI"
                        customContract={mainnetContracts && mainnetContracts.contracts && mainnetContracts.contracts.UNI}
                        signer={userSigner}
                        provider={mainnetProvider}
                        address={address}
                        blockExplorer="https://etherscan.io/"
                      />
                      */}
                      </>
                    }
                  />

                  <Route
                    path="/subgraph"
                    element={
                      <Subgraph
                        subgraphUri={props.subgraphUri}
                        tx={tx}
                        writeContracts={writeContracts}
                        mainnetProvider={mainnetProvider}
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </main>
        </div>
        {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
        <div className="absolute bottom-6 right-6">
          <div className="mb-1 space-x-2">
            <Ramp price={price} address={address} networks={NETWORKS} />
            <GasGauge gasPrice={gasPrice} />
            <a
              href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA"
              className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white"
            >
              💬 Support
            </a>
          </div>
          {/* if the local provider has a signer, let's show the faucet: */}
          {faucetAvailable && <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />}
        </div>
      </div>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div aria-live="assertive" className="fixed inset-0 flex items-start px-4 pt-20 pb-6 pointer-events-none">
        <div className="w-full flex flex-col items-end space-y-4">
          {/* Alert if wrong network is selected */}
          <NetworkDisplay
            NETWORKCHECK={NETWORKCHECK}
            localChainId={localChainId}
            selectedChainId={selectedChainId}
            targetNetwork={targetNetwork}
          />

          {yourLocalBalance.lte(ethers.BigNumber.from('0')) && (
            <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
