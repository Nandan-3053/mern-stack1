import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/UI/LoadingScreen';
import { AuthProvider } from './context/AuthContext';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DeckDetails = lazy(() => import('./pages/Decks/DeckDetails'));
const CreateDeck = lazy(() => import('./pages/Decks/CreateDeck'));
const EditDeck = lazy(() => import('./pages/Decks/EditDeck'));
const StudySession = lazy(() => import('./pages/Study/StudySession'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/decks/create" element={<CreateDeck />} />
            <Route path="/decks/:deckId" element={<DeckDetails />} />
            <Route path="/decks/:deckId/edit" element={<EditDeck />} />
            <Route path="/decks/:deckId/study" element={<StudySession />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  );
}

export default App;