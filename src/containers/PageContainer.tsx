import React, { useEffect, useMemo, useState } from 'react';
import { useLastBlockQuery } from '../hooks/lastBlock/useLastBlockQuery';
import { Wallet } from './Wallet/Wallet';
import Icon from '../components/Icon/Icon';
import './PageContainer.scss';
import moment from 'moment';
import classNames from 'classnames';
import { NetworkStatus } from '@apollo/client';
import { horizontalBar } from '../components/Chart/ChartHeader/ChartHeader';
import { useDebugBoxContext } from '../pages/TradePage/hooks/useDebugBox';
import { Link } from 'react-router-dom';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  const { data: lastBlockData } = useLastBlockQuery();

  const [lastBlockUpdate, setLastBlockUpdate] = useState(moment().valueOf());
  const [sinceLastBlockUpdate, setSinceLastBlockUpdate] = useState(0);

  useEffect(() => {
    setLastBlockUpdate(moment().valueOf());
  }, [lastBlockData?.lastBlock?.parachainBlockNumber]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const duration = moment
        .duration(moment().diff(moment(lastBlockUpdate)))
        .asSeconds();

      setSinceLastBlockUpdate(duration);
    }, 500);

    return () => clearInterval(intervalId);
  }, [lastBlockUpdate]);

  const { debugBox } = useDebugBoxContext();

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <Icon name="BasiliskLogoFull" />
          <div className="page-header__menu-wrapper">
            <div className="page-header__menu-wrapper__menu-item">
              <Link to='trade'>
                Trade
              </Link>
            </div>
            <div className="page-header__menu-wrapper__menu-item">
              <Link to='wallet'>
                Wallet
              </Link>
            </div>
            <div className="page-header__menu-wrapper__menu-item">
              <Link to='pools'>
                Pools
              </Link>
            </div>
            <div className="page-header__menu-wrapper__menu-item">
              <a target="_blank" href='https://docs.bsx.fi/howto_bridge'>
                Bridge
              </a>
            </div>
          </div>
          <div className="page-header__wallet-wrapper">
            <a
              className="page-header__wallet-wrapper__help"
              href="https://docs.bsx.fi"
              rel="noreferrer"
              target="_blank"
            >
              Help
              <Icon name="Help" />
            </a>
            <Wallet />
          </div>
        </div>
        <div className="">{children}</div>

        <div className="footer">
          <div className="liveliness-wrapper">
            <div
              className={classNames('liveliness', {
                green: sinceLastBlockUpdate <= 30,
                orange: sinceLastBlockUpdate > 30,
                red: sinceLastBlockUpdate >= 60,
                gray: !lastBlockData?.lastBlock?.parachainBlockNumber,
              })}
            ></div>
            <span>
              Latest block:
              {lastBlockData?.lastBlock?.parachainBlockNumber
                ? ` ${lastBlockData.lastBlock.parachainBlockNumber}`
                : ` ${horizontalBar}`}
            </span>
          </div>
          <div>
            Version:{' '}
            {process.env.REACT_APP_GITHUB_SHA?.replaceAll('::7', '') !== ''
              ? process.env.REACT_APP_GITHUB_SHA?.slice(0, 7)
              : 'unknown'}
          </div>
        </div>
      </div>
      {debugBox}
    </>
  );
};
