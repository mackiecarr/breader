import { Avatar } from 'antd'
import Immutable from 'immutable'
import React, { Component, PureComponent } from 'react'
import '../styles/ListItem.less'

export interface IListItemReduxState {
    feedFavicons: Immutable.Map<string, string>
}

export interface IListItemOwnProps {
    author?: string
    className?: string
    favicon?: string
    key?: string | number
    style?: any
    guid: string
    feedTitle?: string
    feedId?: number
    time: string
    inid?: number
    title: string
    summary: string
}

export interface IListItemProps extends IListItemOwnProps, IListItemReduxState {
}

interface IListItemState {
    guid: string
}

class ListItem<T extends IListItemProps> extends PureComponent<T> {
    public state: IListItemState
    public constructor(props: T) {
        super(props)
        this.state = {
            guid: this.props.guid,
        }
    }
    public componentWillReceiveProps(props: any) {
        // console.log(props)
    }
    public render () {
        const feedTitle = this.props.feedTitle
        const time = this.props.time
        let favicon = ''
        if (this.props.feedId) {
            favicon = this.props.feedFavicons.get(this.props.feedId + '') || ''
        }
        return (
            <div className={'list-item ' + this.props.className}>
                <div className="item-sider">
                    {/* {favicon ? (<Avatar shape="square" size={22} src={favicon} />) : (
                        <Avatar shape="square" size={22} >{feedTitle ? feedTitle.substring(0, 1) : ''}</Avatar>
                    )} */}
                    <Avatar shape="square" size={22} src={favicon} />
                </div>
                <div className="item-main">
                    <div className="item-header">
                        <div className="item-header-left">{feedTitle}</div>
                        <div className="item-header-right">{time ? time.substring(0, 5) : ''}</div>
                    </div>
                    <div className="item-content">{this.props.title}</div>
                    <div className="item-footer">{this.props.summary}</div>
                </div>
            </div>
        );
    };
}

export default ListItem
