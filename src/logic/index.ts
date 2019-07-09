import { IFeed } from '../schemas'
import { LogicErrorTypes } from './error'
import { parseFeed } from './feedparser'
import { articleDB, feedDB } from './pouchdb'

(window as any).articleDB = articleDB
const Logic = {
    createFeed: async (feedUrl: string) => {
        try {
            const isExists = await feedDB.isFeedExists(feedUrl)
            if (isExists && !isExists.deleteTime) {
                return LogicErrorTypes.PouchDB.EXISTS
            }
            const newFeed = await parseFeed(feedUrl, '')
            if (!newFeed) {
                return LogicErrorTypes.FeedParser.NOT_FOUND
            }
            const response = await feedDB.insertFeed(newFeed)
            if (response && response.ok) {
                newFeed._id = response.id
                newFeed._rev = response.rev
                const articles = newFeed.articles
                if (articles) {
                    articles.forEach(article => (article.feedId = newFeed._id))
                    await articleDB.batchInsertArticles(articles)
                }
            }
            return newFeed
        } catch (err) {
            console.error(err)
            return LogicErrorTypes.UNKNOWN
        }
    },
    deleteFeeds: async (feedIds: string[]) => {
        let changes = 0
        for (const feedId of feedIds) {
            const response = await feedDB.deleteFeed(feedId)
            changes += response.ok ? 1 : 0
        }
        return changes
    },
    getAllFeeds: async () => {
        const feeds = await feedDB.getAllFeeds()
        return feeds
    },
    getArticle: async (articleId: string) => {
        try {
            const article = await articleDB.get(articleId)
            return article
        } catch (err) {
            console.error(err)
            return null
        }
    },
    getArticleContent: async (articleId: string) => {
        const articleContent = await articleDB.getArticleContent(articleId)
        return articleContent
    },
    getArticles: async (selector: PouchDB.Find.Selector = {}, limit: number = 9999, skip: number = 0) => {
        try {
            const articles = await articleDB.queryArticles(selector, limit, skip)
            return articles
        } catch (err) {
            console.error(err)
        }
    },
    setAriclesIsRead: async (articleIds: string[]) => {
        try {
            const changes = await articleDB.batchReadArticles(articleIds);
            return changes
        } catch (err) {
            console.error(err)
            return 0
        }
    },
    setArticleIsRead: async (articleId: string) => {
        try {
            await articleDB.readArticle(articleId)
        } catch (err) {
            console.error(err)
        }
    },
    setArticleIsStarred: async (articleId: string, isStarred: boolean) => {
        try {
            await articleDB.starArticle(articleId, isStarred)
        } catch (err) {
            console.error(err)
        }
    },
    updateFeedArticles: async (feed: IFeed) => {
        const newFeed = await parseFeed(feed.url, feed.etag || '')
        if (!newFeed) {
            return 0
        }
        newFeed.createTime = feed.createTime
        const response = await feedDB.insertFeed(newFeed)
        if (response && response.ok) {
            newFeed._id = response.id
            newFeed._rev = response.rev
            const articles = newFeed.articles
            if (articles) {
                articles.forEach(article => (article.feedId = feed._id))
                await articleDB.batchInsertArticles(articles)
            }
        }
        return 1
    },
}

export default Logic
