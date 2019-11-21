import React from 'react'
import Router from 'next/router'
import { NextAuth } from 'next-auth/client'
import fetch from 'isomorphic-unfetch'
import SidebarNT from '../../components/sidebarnt'
import '../../style/newtelco-rsuite.less'
import {
  Container,
  Header,
  Content,
  Footer,
  Breadcrumb
} from 'rsuite'

class Layout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expand: '',
      settings: {
        companyName: ''
      }
    }
  }

  componentDidMount () {
    const protocol = window.location.protocol
    const host = window.location.host
    const companyInfo = JSON.parse(window.localStorage.getItem('company'))
    const expandStorage = window.localStorage.getItem('layout-expand')
    if (companyInfo) {
      this.setState({
        expand: expandStorage === 'true',
        settings: {
          companyName: companyInfo.companyName
        }
      })
    } else {
      fetch(`${protocol}//${host}/api/settings/company/info`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            window.localStorage.setItem('company', JSON.stringify(data.companyInfo[0]))
            this.setState({
              settings: {
                companyName: data.companyInfo[0].companyName
              }
            })
          }
        })
        .catch(err => console.error(err))
    }
  }

  handleToggle = () => {
    window.localStorage.setItem('layout-expand', !this.state.expand)
    this.setState({
      expand: !this.state.expand
    })
  }

  onSignOutSubmit = (event) => {
    event.preventDefault()
    NextAuth.signout()
      .then(() => {
        Router.push('/auth/callback')
      })
      .catch(err => {
        process.env.NODE_ENV === 'development' && console.err(err)
        Router.push('/auth/error?action=signout')
      })
  }

  capitalizeFirstLetter = (string) => {
    if (string === '') {
      return 'Dashboard'
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  render () {
    return (
      <div className='show-fake-browser sidebar-page wrapper'>
        <Container>
          <SidebarNT />
          <Container className='wrapper'>
            <Header>
              <div className='header-wrapper'>
                <h4 className='header-section-title'>
                  {typeof window !== 'undefined' && this.capitalizeFirstLetter(Router.pathname.split('/').slice(1)[Router.pathname.split('/').slice(1).length - 1].substr(0, Router.pathname.length))}
                </h4>
                <span>
                  <Breadcrumb separator='>' style={{ marginBottom: '0px' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    {typeof window !== 'undefined' &&
                      Router.pathname.split('/').slice(1).map((level, index) => {
                        if (level !== '') {
                          return (
                            <Breadcrumb.Item active={index === Router.pathname.split('/').slice(1).length - 1} key={`${index}${level}`}>
                              {this.capitalizeFirstLetter(level)}
                            </Breadcrumb.Item>
                          )
                        }
                      })}
                  </Breadcrumb>
                </span>
              </div>
            </Header>
            <Content className='content-wrapper'>
              {this.props.children}
            </Content>
            <Footer className='footer-wrapper'>
              {`${this.state.settings.companyName} ${new Date().getFullYear()}`}
            </Footer>
          </Container>
        </Container>
        <style jsx>{`
          :global(.wrapper) {
          }
          :global(.header-wrapper) {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
          }
          :global(.content-wrapper) {
            padding: 20px;
            overflow-y: scroll;
          }
          :global(.footer-wrapper) {
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 10px 20px;
          }
          :global(.logout-btn) {
            background-color: transparent;
            padding: 0;
          }
          :global(.wrapper, .rs-container-has-sidebar) {
            height: 100vh;
          }
          :global(.rs-sidenav) {
            flex-grow: 1;
          }
          :global(.sidenav-header h3) {
            line-height: 20px;
            margin-left: 42px !important;
          }
          :global(.sidenav-header) {
            padding: 18px;
            font-size: 16px;
            height: 56px;
            background: #67B246;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            display: ${!this.state.expand ? 'inline-block' : 'flex'};
            width: ${!this.state.expand ? '56px' : '260px'};
            justify-content: flex-start;
            transition: all 150ms linear;
          }
          :global(.header-section-title) {
            font-size: 1.3rem;
            font-weight: 400;
          }
          :global(.icon-style) {
            width: 56px;
            height: 56px;
            line-height: 56px;
            text-align: center;
          }
          :global(.rs-btn-subtle.rs-btn-active) {
            color: #8e8e93;
          }
          :global(::-webkit-scrollbar-track) {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0);
            border-radius: 10px;
            background-color: rgba(0,0,0,0);
          }
          :global(::-webkit-scrollbar) {
            width: 8px;
            height: 8px;
            background-color: transparent;
          }
          :global(::-webkit-scrollbar-thumb) {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
            background-color: rgba(0,0,0,0.4);
          }
        `}
        </style>
      </div>
    )
  }
}

export default Layout
