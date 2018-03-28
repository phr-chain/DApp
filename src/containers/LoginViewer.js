import React, { Component } from 'react';
import '../App.css';
import * as antd from "antd"
// import { Row, Col } from 'antd'
// import 'antd/lib/button/style/css';

import * as EncryptionHelper from '../utils/EncryptionHelper'
import * as CommonHelper from '../utils/CommonHelper'

class LoginViewer extends Component {

    generatePblicKey() {
        var pubKey = EncryptionHelper.extractPubKey(this.props.privateKey);
        this.props.onPublicKeyChanged(pubKey);

    }
    login() {
        if (!CommonHelper.isValidString(this.props.privateKey) || !CommonHelper.isValidString(this.props.publicKey)) {
            CommonHelper.notify("Enter  public and private keys")
            return;
        }
        this.props.onLogin();
    }
    createAccount() {
        var keys = EncryptionHelper.generatePubPrivateKeys();
        this.props.onPublicKeyChanged(keys.publicKey);
        this.props.onPrivateKeyChanged(keys.privateKey);
    }
    onpredefinedUsersChanged(e, predefinedUsers) {
        var selIndex = e.currentTarget.selectedIndex;
        var selected = predefinedUsers[selIndex - 1 /*For place holder*/];

        this.props.onPublicKeyChanged(selected.pubKey);
        this.props.onPrivateKeyChanged(selected.prKey);

    }


    render() {
        const predefinedUsers = [
            {
                'name': 'Mahmoud',
                'prKey': '7bDAc2SHAoCCEjDc3UPqxmNH3nmNpxUSt38d27HTjibn',
                'pubKey': 'N16nHAtCmhQaskXnid3pmB6yUtCP5u1kt4gvnmu7xH2GHDDNnjzjqwEyySDrvyrDSLLgRFv9Mrnp3NxLtHdYnhPS',
            },
            {
                'name': 'Taher',
                'prKey': '8KuMhTK1xvm3GFi7Px45BdBTvJYRJmfu7aDH1RDTx182',
                'pubKey': 'RbjDdsScEadEFoQKAqTvbsK5ehk95XbVcuVXNmVgZUN3vNLYrTKk1Vb1boRBZ561E2bNYuhPGqhb7dYYjxTtf5ro',
            },
            {
                'name': 'Maha',
                'prKey': 'HNYp8mKtJtFaSqbkm9et84vM6UWuQNiAmL3pZN4U8Sw9',
                'pubKey': 'QYdZj11vKCZvrwUwXDcT6a8S4jz6hMbeBQyiQEqaewXUeDTYJDEHFo4KT33v3bdvY5JRB2juwL27LXjHJc4dHuUG',
            },
            {
                'name': 'Guest',
                'prKey': 'BSdELCcj4tDjBNjxG8wTvtNYva7s3PaK5zreoFctWW79',
                'pubKey': 'NV2mPxLaWXJR8TWBgUDjtwc16Sy1nRvWd2hkSqKnJNPj6Gfy7nyfZEexsWppLexWYCZyktSgL7kR4vVnT71TnfQz',
            },
        ];
        return (
            <div className='page-container'>

                <select className='input-common' onChange={e => this.onpredefinedUsersChanged(e, predefinedUsers)}>
                    <option value="none" disabled selected>Select from predefined users</option>
                    {
                        predefinedUsers.map((u, i) => <option key={i} value={u.pubKey}>{u.name}</option>)
                    }
                </select>
                <br />
                <br />
                <input
                    placeholder='Enter your private key'
                    className='input-common'
                    value={this.props.privateKey}
                    onChange={e => this.props.onPrivateKeyChanged(e.target.value)}
                />
                <antd.Button
                    className='btn-generatePubKey'
                    onClick={e => this.generatePblicKey()}>
                    Generate public key
                </antd.Button>
                <br />
                <input
                    placeholder='Enter your public key'
                    className='input-common'
                    value={this.props.publicKey}
                    onChange={e => this.props.onPublicKeyChanged(e.target.value)}
                />
                <br />
                <br />

                <antd.Button
                    className='btn-common btn-login'
                    onClick={e => this.login()}>
                    Login
                </antd.Button>
                <antd.Button
                    className='btn-common btn-createaccount'
                    onClick={e => this.createAccount()}>
                    Generate new keys
                </antd.Button>

            </div>
        );
    }
}

export default LoginViewer;