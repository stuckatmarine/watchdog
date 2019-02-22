/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Switch, Route, withRouter } from 'react-router';

// an example of react-router code-splitting
/* eslint-disable */
import loadPrivacy from 'bundle-loader?lazy!../../pages/privacy';
import loadProfile from 'bundle-loader?lazy!../../pages/profile';
import loadTypography from 'bundle-loader?lazy!../../pages/typography';
import loadTables from 'bundle-loader?lazy!../../pages/tables';
import loadButtons from 'bundle-loader?lazy!../../pages/buttons';
import loadNotifications from 'bundle-loader?lazy!../../pages/notifications';
import loadCharts from 'bundle-loader?lazy!../../pages/charts';
import loadIcons from 'bundle-loader?lazy!../../pages/icons';
import loadMaps from 'bundle-loader?lazy!../../pages/google';
import loadNotFound from 'bundle-loader?lazy!../../pages/notFound';
/* eslint-enable */

import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';
import Bundle from '../../core/Bundle';
import Sidebar from '../Sidebar';

// Dashboard component is loaded directly as an example of server side rendering
import Dashboard from '../../pages/tables/Tables';

const PrivacyBundle = Bundle.generateBundle(loadPrivacy);
const ProfileBundle = Bundle.generateBundle(loadProfile);
const TypographyBundle = Bundle.generateBundle(loadTypography);
const TablesBundle = Bundle.generateBundle(loadTables);
const ButtonsBundle = Bundle.generateBundle(loadButtons);
const NotificationsBundle = Bundle.generateBundle(loadNotifications);
const ChartsBundle = Bundle.generateBundle(loadCharts);
const IconsBundle = Bundle.generateBundle(loadIcons);
const MapsBundle = Bundle.generateBundle(loadMaps);
const NotFoundBundle = Bundle.generateBundle(loadNotFound);

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpen: false,
    };
  }

  render() {
    return (
      <div className={s.root}>
        <Sidebar />
        <div
          className={cx(s.wrap, {[s.sidebarOpen]: this.state.sidebarOpen})}
        >
          <Header
            sidebarToggle={() =>
              this.setState({
                sidebarOpen: !this.state.sidebarOpen,
              })
            }
          />
          <main className={s.content}>
            <Switch>
              <Route path="/app" exact component={Dashboard} />
              <Route path="/app/privacy" exact component={PrivacyBundle} />
              <Route path="/app/profile" exact component={ProfileBundle} />
              <Route path="/app/typography" exact component={TypographyBundle} />
              <Route path="/app/tables" exact component={TablesBundle} />
              <Route path="/app/notifications" exact component={NotificationsBundle} />
              <Route path="/app/components/buttons" exact component={ButtonsBundle} />
              <Route path="/app/components/charts" exact component={ChartsBundle} />
              <Route path="/app/components/icons" exact component={IconsBundle} />
              <Route path="/app/components/maps" exact component={MapsBundle} />
              <Route component={NotFoundBundle} />
            </Switch>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(s)(Layout));
