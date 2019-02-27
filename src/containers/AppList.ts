import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import AppList from '../components/AppList'
import { asyncFetchFeedsAction } from '../redux/actions'
import InterfaceArticle from '../schemas/InterfaceArticle'

const mapStateToProps = (store: any, props: any) => {
    return {
        articleId: store.articles.get('selectedId'),
        articles: store.articles.get('list'),
        feedFavicons: store.feeds.get('favicons'),
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, props: any) => ({
    // setArticleId: (id: number) => dispatch(setArticleIdAction(id)),
    // setArticles: (articles: InterfaceArticle[]) => dispatch(setArticlesAction(articles)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppList)
