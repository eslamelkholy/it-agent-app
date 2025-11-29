import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketProvider } from './context';
import { Layout } from './components';
import { Dashboard, TicketListPage, TicketDetail, CreateTicket } from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketListPage />} />
            <Route path="/tickets/create" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
          </Routes>
        </Layout>
      </TicketProvider>
    </BrowserRouter>
  );
}

export default App;
