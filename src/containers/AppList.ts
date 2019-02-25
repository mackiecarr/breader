import { connect } from 'react-redux'
import { Dispatch } from 'redux'
// import { addFeedsAction, setFeedsAction, setMenuKeyAction, InterfaceFeedsAction } from '../actions'
import AppList from '../components/AppList'
// import InterfaceFeed from '../schemas/InterfaceFeed'

const mapStateToProps = (store: any, props: any) => {
    return {
        articles: store.articles,
        feedFavicons: store.feedFavicons,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, props: any) => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppList)
