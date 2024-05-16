import '@blueprintjs/core/lib/css/blueprint.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from './ErrorBoundary';
import Root from './Root';
import store from './api';
import { initApiClients } from './api/api-manager/api-initializer';

function App() {
  initApiClients();

  return (
    <RecoilRoot>
      <Provider store={store}>
        <BrowserRouter>
          <ErrorBoundary>
            <Root />
          </ErrorBoundary>
        </BrowserRouter>
      </Provider>
    </RecoilRoot>
  );
}

export default App;
