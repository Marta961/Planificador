import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FinanceProvider } from './context/FinanceProvider'
import { AppLayout } from './layouts/AppLayout'
import { EditTransactionPage } from './pages/EditTransactionPage'
import { NewTransactionPage } from './pages/NewTransactionPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TransfersHomePage } from './pages/TransfersHomePage'

function App() {
  return (
    <BrowserRouter>
      <FinanceProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<TransfersHomePage />} />
            <Route path="nuevo" element={<NewTransactionPage />} />
            <Route path="editar/:id" element={<EditTransactionPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </FinanceProvider>
    </BrowserRouter>
  )
}

export default App
