import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import EnzymeToJson from 'enzyme-to-json'
import Immutable from 'immutable'
import React from 'react'
import { IntlProvider } from 'react-intl'
import SearchArticleModal, {
  ISearchArticleModalProps,
  ISearchArticleModalState,
} from '../components/SearchArticleModal'
import { IArticle } from '../schemas'
import { article, intlProviderProps } from './MockData'

Enzyme.configure({ adapter: new EnzymeAdapter() })

describe('SearchArticleModal Testing', () => {
  jest.useFakeTimers()
  const mockProps: ISearchArticleModalProps = {
    articles: Immutable.List<IArticle>([article]),
    onCancel: jest.fn(),
    onItemChoose: jest.fn(),
    visible: true,
  }

  it('dom testing', () => {
    const wrapper = Enzyme.mount<
      React.Component,
      ISearchArticleModalProps,
      ISearchArticleModalState
    >(
      <IntlProvider {...intlProviderProps}>
        <SearchArticleModal {...mockProps} />
      </IntlProvider>
    )
    wrapper.setProps({
      visible: false,
    })
    wrapper.setProps({
      visible: true,
    })
    wrapper.setProps({
      articles: Immutable.List<IArticle>([article]),
    })
    wrapper.update()
    wrapper.setState({
      keywords: 'article title',
    })
    wrapper.find('input').simulate('change')
    wrapper.setState({
      matchedArticles: Immutable.List<IArticle>([article]),
    })
    expect(wrapper.state().matchedArticles).toHaveProperty('size', 1)
  })

  it('snapshot testing', () => {
    const component = Enzyme.mount(
      <IntlProvider {...intlProviderProps}>
        <SearchArticleModal {...mockProps} />
      </IntlProvider>
    )
    const tree = EnzymeToJson(component)
    expect(tree).toMatchSnapshot()
  })
})
