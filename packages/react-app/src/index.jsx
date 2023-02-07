import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Home, CreateBattle, JoinBattle, Battle, Battleground } from './page';
import StateContext from './context/StateContext';
import { OnboardModal } from './components/avaxgods';
import 'react-tooltip/dist/react-tooltip.css';
const subgraphUri = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <StateContext>
        {/* <OnboardModal /> */}
        {/* <App subgraphUri={subgraphUri} /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<App subgraphUri={subgraphUri} />} />
          <Route path="/create-battle" element={<CreateBattle />} />
          <Route path="/join-battle" element={<JoinBattle />} />
          <Route path="/battleground" element={<Battleground />} />
          <Route path="/battle/:battleName" element={<Battle />} />
        </Routes>
      </StateContext>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
);
