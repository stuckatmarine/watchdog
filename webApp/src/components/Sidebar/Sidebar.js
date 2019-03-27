import React from 'react';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {withRouter, Link} from 'react-router-dom';

import Icon from '../Icon';
import LinksGroup from './LinksGroup/LinksGroup';

import s from './Sidebar.scss';

const Sidebar = () => (
  <nav className={s.root}>
    <header className={s.logo}>
      <Link to="/app">
        <Icon glyph="logo" />
      </Link>
    </header>
    <ul className={s.nav}>
      <LinksGroup
        header="Dashboard"
        headerLink="/app/tables"
        glyph="dashboard"
      />
      <LinksGroup
        header="Notifications"
        headerLink="/app/notifications"
        glyph="notifications"
      />
      <LinksGroup
        header="Profile"
        headerLink="/app/profile"
        glyph="typography"
      />
    </ul>
  </nav>
);

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Sidebar)));
