import { Drawer, Icon, Progress } from 'antd'
import React, { Component, createRef, RefObject } from 'react'
import Utils from '../utils'
import ProgressBar from './ProgressBar'

import '../styles/WebviewDrawer.less'

interface IWebviewDrawerProps {
    visible: boolean
    src: string
    width: string | number
    onClose: (e: any) => any
}
interface IWebviewDrawerState {
    hasProgressBar: boolean
}

class WebviewDrawer extends Component<IWebviewDrawerProps, IWebviewDrawerState> {
    public webview: any
    public openTimes: number
    public userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    private _progressBar: RefObject<ProgressBar>
    private _needUpdateWebview: boolean
    public constructor(props: IWebviewDrawerProps) {
        super(props)
        this.state = { hasProgressBar: false }
        this._progressBar = createRef<ProgressBar>()
        this._needUpdateWebview = false
        this.openTimes = 0
    }
    public handleCompassClick = () => {
        if (this.props.src) {
            Utils.openExternalUrl(this.props.src)
        }
    }
    public handleDrawerClose = (e: any) => {
        this.props.onClose(e)
        const times = this.openTimes
        const webview = this.webview
        const src = this.webview.src
        setTimeout(() => {
            if (this.webview && this.openTimes === times && this.props.visible === false &&
                webview === this.webview && this.webview.src === src) {
                this.webview.remove()
                this.webview = null
            }
        }, 10 * 1000)
    }
    public makeWebView(url: string) {
        if (this.webview) {
            this.webview.src = url
        } else {
            const div = document.querySelector('.drawer-content')
            if (div) {
                this.webview = document.createElement('webview')
                this.webview.addEventListener('did-start-loading', this.showProgressBar)
                this.webview.addEventListener('did-stop-loading', this.hideProgressBar)
                this.webview.src = url
                this.webview.useragent = this.userAgent
                div.appendChild(this.webview)
            }
        }
    }
    public showProgressBar = () => {
        this.setState({hasProgressBar: true})
    }
    public hideProgressBar = () => {
        const bar = this._progressBar.current
        if (bar) {
            bar.toEnd()
        }
    }
    public handleProgressBarEnd = () => {
        this.setState({ hasProgressBar: false })
    }
    public componentDidUpdate = () => {
        if (this._needUpdateWebview) {
            this._needUpdateWebview = false
            this.setState({
                hasProgressBar: true,
            })
            if (this.webview) {
                this.makeWebView(this.props.src)
            } else {
                setTimeout(() => {
                    this.makeWebView(this.props.src)
                }, 800)
            }
        }
    }
    public componentWillReceiveProps(props: any) {
        if (props.visible) {
            this.openTimes++
            if (!this.webview || (this.webview.src !== props.src)) {
                this._needUpdateWebview = true
            }
        }
    }
    public componentWillUnmount() {
        this.setState = () => null
    }
    public render() {
        return (<Drawer className="webview-drawer"
            closable={false}
            visible={this.props.visible}
            onClose={this.handleDrawerClose}
            width={this.props.width}>
            <div className="drawer-header">
                <div className="drawer-header-left" onClick={this.handleDrawerClose} >
                    <Icon type="close" />
                </div>
                <div className="drawer-header-right" onClick={this.handleCompassClick} >
                    <Icon type="compass" />
                </div>
                {/* <Progress className="webview-progress" style={{ display: this.state.hasProgressBar ? 'block' : 'none' }}
                    status={this.state.isProgressActive ? 'active' : 'normal'}
                    showInfo={false}
                    strokeColor="#ffa81e"
                    percent={this.state.progress}
                    type="line"
                    strokeWidth={3}
                /> */}
                {this.state.hasProgressBar && <ProgressBar ref={this._progressBar}
                    className="webview-progress"
                    time={6} max={90} onEnd={this.handleProgressBarEnd} />}
            </div>
            <div className="drawer-content">
                {/* <webview ref={this.wvRef} style={{height: '100%'}} src={this.props.src}/> */}
            </div>
        </Drawer>)
    }
}

export default WebviewDrawer
