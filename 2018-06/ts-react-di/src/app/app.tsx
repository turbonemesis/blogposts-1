import React, { Component } from 'react'

import { injector, Service, Service2, Http } from './services'
import { Provider, Inject } from './inject'
import { HeroesModule } from './heroes/heroes.module'
import { Logger, LoggerConfig } from './core/logger.service'

export class App extends Component {
  render() {
    return (
      <Provider
        provide={[
          Service,
          Service2,
          Http,
          Logger,
          {
            provide: LoggerConfig,
            useValue: {
              allow: false,
            },
          },
        ]}
      >
        <main>
          <h1>React + Angular service DI</h1>
          <Child />
        </main>
      </Provider>
    )
  }
  componentDidMount() {
    // console.log(injector.get(Service) instanceof Service)
    // console.log(injector.get(Service2))
  }
}

class Child extends Component {
  render() {
    return (
      <>
        <HeroesModule />
        <h2>Parent Injector</h2>
        <Inject injectablesMap={{ service: Service, service2: Service2, logger: Logger }}>
          {(props) => {
            return (
              <>
                <div>Hello {props.service2.who}</div>
                <button
                  onClick={() => {
                    props.logger.log(props.injector.get(Service2))
                  }}
                >
                  Get service2 instance from root injector
                </button>
                <hr />
              </>
            )
          }}
        </Inject>
        {/* Here we create child provider with it's own Service instance! */}
        <Provider provide={[Service]}>
          <div>
            <h3>Child Injector</h3>
            <Inject injectablesMap={{ service: Service, service2: Service2, logger: Logger }}>
              {(props) => {
                return (
                  <>
                    <div>Hello {props.service2.who}</div>
                    <button
                      onClick={() => {
                        const childService = props.injector.get(Service)
                        const parentService = props.injector.parent!.get(Service)
                        const childService2 = props.injector.get(Service2)
                        const parentService2 = props.injector.parent!.get(Service2)
                        props.logger.log(
                          'is child and parent service equal?',
                          childService === parentService
                        )
                        props.logger.log(childService, parentService)
                        props.logger.log(
                          'is child and parent service2 equal?',
                          childService2 === parentService2
                        )
                      }}
                    >
                      Get services from parent and child injector
                    </button>
                    <hr />
                  </>
                )
              }}
            </Inject>
          </div>
        </Provider>
      </>
    )
  }
}
