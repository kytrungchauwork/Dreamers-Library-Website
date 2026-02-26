import { useRoutes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import HomePage from '@/pages/HomePage';
import StoryDetailPage from '@/pages/StoryDetailPage';
import ReadingPage from '@/pages/ReadingPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ReadingLayout from '@/layouts/ReadingLayout';
import AccountPage from '@/pages/AccountPage';
import SearchPage from '@/pages/SearchPage';
import HistoryPage from '@/pages/HistoryPage';
import AllStoriesPage from '@/pages/AllStoriesPage';
import LibraryPage from '@/pages/LibraryPage';
import UploadStoryPage from '@/pages/UploadStoryPage';
import UploadChapterPage from '@/pages/UploadChapterPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import TermsPage from '@/pages/TermsPage';

import ForbiddenPage from '@/pages/ForbiddenPage';
// Admin
import AdminRoute from "@/routes/AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageStories from "@/pages/admin/ManageStories";
import ManageUsers from "@/pages/admin/ManageUsers";
import ModeratorStories from '../pages/moderator/ModeratorStories';
import ModeratorRoute from '@/routes/ModeratorRoute';
import ModeratorLayout from '@/layouts/ModeratorLayout';
import ModeratorDashboard from '@/pages/moderator/ModeratorDashboard';
import ModeratorReports from '@/pages/moderator/ModeratorReports';

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <HomePage />
        },
        {
          path: 'truyen/:storyId',
          element: <StoryDetailPage />
        },
        {
          path: 'account',
          element: <AccountPage />
        },
        {
          path: 'history',
          element: <HistoryPage />
        },
        {
          path: 'tat-ca',
          element: <AllStoriesPage />
        },
        {
          path: 'library',
          element: <LibraryPage/>
        },
        {
          path: 'tim-kiem', 
          element: <SearchPage />
        },
        {
          path: 'upload-story',
          element: <UploadStoryPage />
        },
        {
          path: 'upload-chapter',
          element: <UploadChapterPage />
        },
        // --- Nhóm các trang thông tin từ nhánh main ---
        {
          path: 'about-us',
          element: <AboutPage />
        },
        {
          path: 'contact',
          element: <ContactPage />
        },
        {
          path: 'terms',
          element: <TermsPage />
        },
        // --- Nhóm các trang Admin từ nhánh ĐAnh ---
        {
          path: '403',
          element: <ForbiddenPage />
        },
        {
          path: 'admin',
          element: (
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          ),
          children: [
            { path: '', element: <AdminDashboard /> },
            { path: 'stories', element: <ManageStories /> },
            { path: 'users', element: <ManageUsers /> }
          ]
        },
        {
          path: 'moderator',
          element: (
            <ModeratorRoute>
              <ModeratorLayout />
            </ModeratorRoute>
          ),
          children: [
            { path: '', element: <ModeratorDashboard /> },
            { path: 'stories', element: <ModeratorStories /> },
            { path: 'reports', element: <ModeratorReports />}
          ]
        },
      ]
    },
    {
      path: '/truyen/:storyId/chuong/:chapterId',
      element: <ReadingLayout />,
      children: [
        {
          path: '',
          element: <ReadingPage />
        }
      ]
    },
    {
      element: <AuthLayout />,
      children: [
        { path: '/dang-nhap', element: <LoginPage /> },
        { path: '/dang-ky', element: <SignUpPage /> },
        { path: '/quen-mat-khau', element: <ForgotPasswordPage /> },
        { path: '/dat-lai-mat-khau', element: <ResetPasswordPage /> }
      ]
    },
  ]);

  return routes;
};

export default AppRoutes;