// src/App.jsx
import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./component/Layout/Navbar";
import Footer from "./component/Layout/Footer";
import ScrollToTop from "./ScrollToTop";
import PageTransition from "./component/Common/PageTransition";
import ErrorBoundary from "./component/Common/ErrorBoundary";
import Popup from "./pages/Popup";
import "./App.css";
import { isTokenValid, getUser } from "./utils/tokenManager";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const OurTeam = lazy(() => import("./pages/OurTeam"));
const LegalStatus = lazy(() => import("./pages/LegalStatus"));
const OurWork = lazy(() => import("./pages/OurWork"));
const QualityEducation = lazy(() => import("./pages/QualityEducation"));
const Livelihood = lazy(() => import("./pages/Livelihood"));
const Healthcare = lazy(() => import("./pages/Healthcare"));
const EnvironmentSustainability = lazy(() => import("./pages/EnvironmentSustainability"));
const IDP = lazy(() => import("./pages/IDP"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const CorporatePartnership = lazy(() => import("./pages/Corporatepartnership"));
const Careers = lazy(() => import("./pages/Careers"));
const MediaCorner = lazy(() => import("./pages/MediaCorner"));
const Newsletters = lazy(() => import("./pages/NewsLetters"));
const Stories = lazy(() => import("./pages/Stories"));
const Events = lazy(() => import("./pages/Events"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Documentaries = lazy(() => import("./pages/Documentaries"));
const Contact = lazy(() => import("./pages/Contact"));
const LegalReports = lazy(() => import("./pages/LegalReports"));
const VolunteersInternship = lazy(() => import("./pages/VolunteersInternship"));
const IndiaMapHover = lazy(() => import("./pages/IndiaMapHover"));
const DonateNow = lazy(() => import("./pages/DonateNow"));
const ReachPresence = lazy(() => import("./pages/ReachPresence"));
const LogoSlider = lazy(() => import("./pages/LogoSlider"));

// Detail pages
const QualityEducationDetail = lazy(() => import("./pages/QualityEducationDetail"));
const LivelihoodDetail = lazy(() => import("./pages/LivelihoodDetail"));
const HealthcareDetail = lazy(() => import("./pages/HealthcareDetail"));
const EnvironmentSustainabilityDetail = lazy(() => import("./pages/EnvironmentSustainabilityDetail"));
const IDPDetail = lazy(() => import("./pages/IDPDetail"));

// Auth pages
const Dashboard = lazy(() => import("./component/Dashboard/Dashboard"));
const LoginPage = lazy(() => import("./component/Auth/LoginPage"));
const PublicRegistrationForm = lazy(() => import("./component/Registration/PublicRegistrationForm"));
const PasswordResetPage = lazy(() => import("./component/Auth/PasswordResetPage"));
const RegionSelect = lazy(() => import("./pages/Admin/RegionSelect"));

// Loading fallback component
const PageLoader = () => <PageTransition />;

function AppContent({
  isAuthenticated,
  setIsAuthenticated,
  currentUser,
  setCurrentUser,
}) {
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  // Trigger transition on every route change
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 1700);
    return () => clearTimeout(timer);
  }, [location]);

  if (pageLoading) {
    return <PageTransition />;
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Popup />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <main>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/our-team" element={<OurTeam />} />

                        <Route path="/legal-status" element={<LegalStatus />} />
                        <Route path="/our-work" element={<OurWork />} />
                        <Route
                          path="/quality-education"
                          element={<QualityEducation />}
                        />
                        <Route
                          path="/quality-education/:id"
                          element={<QualityEducationDetail />}
                        />
                        <Route path="/livelihood" element={<Livelihood />} />
                        <Route
                          path="/livelihood/:id"
                          element={<LivelihoodDetail />}
                        />
                        <Route path="/healthcare" element={<Healthcare />} />
                        <Route
                          path="/healthcare/:id"
                          element={<HealthcareDetail />}
                        />
                        <Route
                          path="/environment-sustainability"
                          element={<EnvironmentSustainability />}
                        />
                        <Route
                          path="/environment-sustainability/:id"
                          element={<EnvironmentSustainabilityDetail />}
                        />

                        <Route path="/idp" element={<IDP />} />
                        <Route path="/idp/:id" element={<IDPDetail />} />
                        <Route path="/get-involved" element={<GetInvolved />} />
                        <Route
                          path="/corporate-partnership"
                          element={<CorporatePartnership />}
                        />
                        <Route
                          path="/volunteers-internship"
                          element={<VolunteersInternship />}
                        />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/media-corner" element={<MediaCorner />} />
                        <Route path="/newsletters" element={<Newsletters />} />
                        <Route path="/stories" element={<Stories />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/blogs/:id" element={<BlogDetails />} />
                        <Route path="/documentaries" element={<Documentaries />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/legalreports" element={<LegalReports />} />
                        <Route path="/india-map" element={<IndiaMapHover />} />
                        <Route path="/DonateNow" element={<DonateNow />} />
                        <Route path="/reach-presence" element={<ReachPresence />} />
                        <Route path="/logo-slider" element={<LogoSlider />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </>
              }
            />

            <Route path="/register" element={<PublicRegistrationForm />} />
            <Route path="/signup" element={<PublicRegistrationForm />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />

            {/* Admin routes */}
            <Route
              path="/admin/region-select"
              element={
                isAuthenticated && currentUser ? (
                  <RegionSelect />
                ) : (
                  <LoginPage
                    onLogin={(user) => {
                      setCurrentUser(user);
                      setIsAuthenticated(true);
                    }}
                  />
                )
              }
            />
            <Route
              path="/admin/*"
              element={
                isAuthenticated && currentUser ? (
                  localStorage.getItem('adminRegion') ? (
                    <Dashboard currentUser={currentUser} />
                  ) : (
                    <RegionSelect />
                  )
                ) : (
                  <LoginPage
                    onLogin={(user) => {
                      setCurrentUser(user);
                      setIsAuthenticated(true);
                    }}
                  />
                )
              }
            />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());
  const [currentUser, setCurrentUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </Router>
  );
}

export default App;
