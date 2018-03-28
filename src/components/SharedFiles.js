import React, { Component } from 'react';
import '../App.css'

class SharedFiles extends Component {
    renderDownload(file){
        return this.props.downloadFile ? <button className='btn-inline right_align' onClick={e => this.props.downloadFile(file)}> Download</button>: null;
    }
    render() {
        const hasFiles = this.props.files;
        if (hasFiles){
            let myFileCopy = this.props.myFiles;
            return (
                <table className='inline_dislay'>
                    <tbody>
                        <tr className='center-text'><h2>{this.props.title}:</h2></tr>
                        <tr>
                            <th>File name</th>
                            <th>{this.props.sharedWithMeMode ? 'Shared by' : 'Shared to'}</th>
                        </tr>
                        {
                            
                            this.props.files.map((file, i) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            {myFileCopy.find(f=>{return f.fileAddress == file.fileAddress}).fileName}
                                            {this.renderDownload(file)}
                                        </td>
                                        <td>
                                            {file.toAddress}
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

export default SharedFiles;