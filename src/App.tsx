import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketProvider } from './context';
import { Layout } from './components';
import { Dashboard, TicketListPage, TicketDetail, CreateTicket, FrontPlugin } from './pages';
import { FrontContextProvider } from './providers/FrontContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        <Routes>
          {/* Front Plugin Route - No Layout wrapper for embed in Front sidebar */}
          <Route 
            path="/front-plugin" 
            element={
              <FrontContextProvider>
                <FrontPlugin />
              </FrontContextProvider>
            } 
          />
          
          {/* Main App Routes */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tickets" element={<TicketListPage />} />
                <Route path="/tickets/create" element={<CreateTicket />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </TicketProvider>
    </BrowserRouter>
  );
}

export default App;
