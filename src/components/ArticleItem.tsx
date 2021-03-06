import { Avatar } from 'antd'
import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import defaultFavicon from '../images/rss.png'
import { IFeed } from '../schemas'
import '../styles/ArticleItem.less'
import Utils from '../utils'

export interface IArticleItemOwnProps {
  author?: string
  className?: string
  key?: string | number
  style?: any
  guid: string
  feedId: string
  time: number
  title: string
  summary: string
}

export interface IArticleItemDispatchProps {}

export interface IArticleItemStateProps {
  feedsMap: Immutable.Map<string, IFeed>
}

export interface IArticleItemProps
  extends IArticleItemOwnProps,
    IArticleItemDispatchProps,
    IArticleItemStateProps {}

class ArticleItem<T extends IArticleItemProps> extends PureComponent<
  T & WrappedComponentProps
> {
  public constructor(props: T & WrappedComponentProps) {
    super(props)
  }
  public render() {
    const {
      className,
      feedId,
      feedsMap,
      intl,
      summary,
      time,
      title,
    } = this.props
    const dateTime = Utils.timeToTimeString(time)
    const feed = feedsMap.get(feedId)
    const feedTitle = feed ? feed.title : intl.formatMessage({ id: 'unknown' })
    const favicon = feed ? feed.favicon : defaultFavicon
    return (
      <div className={'article-item ' + className}>
        <div className="item-sider">
          {favicon ? (
            <Avatar shape="square" size={22} src={favicon} />
          ) : (
            <Avatar shape="square" size={22}>
              {feedTitle ? feedTitle.substring(0, 1) : ''}
            </Avatar>
          )}
        </div>
        <div className="item-main">
          <div className="item-header">
            <div className="item-header-left">{feedTitle}</div>
            <div className="item-header-right">{dateTime}</div>
          </div>
          <div className="item-content">{title}</div>
          <div className="item-footer">{summary}</div>
        </div>
      </div>
    )
  }
}

export default injectIntl(ArticleItem)
