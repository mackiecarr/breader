import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { IReduxAction } from '../../schemas'
import { ArticlesActionTypes, MenuActionTypes } from '../actions'
import { makeSagaWorkersDispatcher } from './helpers'

export function* selectMenuKeySaga(action: IReduxAction) {
    try {
        yield put({ type: MenuActionTypes.SET_SELECTED_MENU_KEY, payload: action.payload })
        yield put({ type: ArticlesActionTypes.ASYNC_FETCH_ARTICLES, payload: null })
    } catch (e) {
        console.error(e)
    }
}

const dispatcher = makeSagaWorkersDispatcher({
    [MenuActionTypes.ASYNC_SELECT_MENU_KEY]: selectMenuKeySaga,
})

export function* watchSelectMenuKey() {
    yield takeLatest(MenuActionTypes.ASYNC_SELECT_MENU_KEY, dispatcher)
}
