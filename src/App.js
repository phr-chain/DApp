import React, { Component } from 'react';

import UserDashBoard from './containers/UserDashBoard'
import LoginViewer from './containers/LoginViewer'

const loginView = 0;
const dashBoardView = 1;
class App extends Component {
  constructor() {
    super();
    this.state = {
      privateKey: '',
      publicKey: '',
      currentView: loginView,
    }
  }
  render() {
    if (this.state.currentView === loginView) {
      return (
        <LoginViewer
          privateKey={this.state.privateKey}
          publicKey={this.state.publicKey}
          onPrivateKeyChanged={key => this.setState({ privateKey: key })}
          onPublicKeyChanged={key => this.setState({ publicKey: key })}
          onLogin={() => this.setState({ currentView: dashBoardView })}
        />
      );
    } else if (this.state.currentView === dashBoardView) {
      return (
        <UserDashBoard
          privateKey={this.state.privateKey}
          publicKey={this.state.publicKey}
          onLogout={() => this.setState({ currentView: loginView })}
        />
      );
    } else {
      return <div></div>
    }

  }
}

export default App;
