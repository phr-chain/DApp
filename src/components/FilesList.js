import React, { Component } from 'react';
import '../App.css'

class FilesList extends Component {
    render() {
        const hasFiles = this.props.files;
        if (hasFiles){
            return (
                <table className='inline_dislay'>
                    <tbody>
                        <tr className='center-text'><h2>{this.props.title}:</h2></tr>
                        <tr>
                            <th>File name</th>
                        </tr>
                        {
                            this.props.files.map((file, i) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            {/* {EncryptionHelper.decrypt(file.encryptedFileName, file.encryptedSymmetricKey, this.props.privateKey)} */}
                                            {file.fileName}
                                            <button className='btn-inline right_align' onClick={e => this.props.downloadMyFile(file)}> Download</button>
                                            <button className='btn-inline right_align' onClick={e => this.props.shareMyFile(file)}> Share</button>
                                        </td>
                                    </tr>)
                            })
                        }
                    </tbody>
                </table>
            );
        } else {
            return <div>No Files</div>
        }
    }
}

export default FilesList;