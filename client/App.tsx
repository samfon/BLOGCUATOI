import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BlogProvider, useBlog } from './contexts/BlogContext';
import Index from './pages/Index';
import Posts from './pages/Posts';
import Categories from './pages/Categories';
import CategoryPosts from './pages/CategoryPosts';
import PostDetail from './pages/PostDetail';
import Write from './pages/Write';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { Loader2 } from 'lucide-react';

/**
 * Component chịu trách nhiệm điều hướng và bảo vệ các route
 */
function AppRoutes() {
  const { user, loading } = useBlog();

  // Nếu context vẫn đang trong quá trình tải (kiểm tra auth),
  // hiển thị một màn hình loading toàn trang.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Route cho người dùng public */}
      <Route path="/" element={<Index />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:name" element={<CategoryPosts />} />

      {/* Route đăng nhập */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/write" /> : <Login />} 
      />

      {/* Các route được bảo vệ, chỉ user đã đăng nhập mới vào được */}
      <Route 
        path="/write" 
        element={user ? <Write /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/edit/:id" 
        element={user ? <Write /> : <Navigate to="/login" />} 
      />
      
      {/* Route cho trang không tìm thấy */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * Component gốc của ứng dụng
 */
export default function App() {
  return (
    // BlogProvider phải bao bọc Router để tất cả các route có thể truy cập context
    <BlogProvider>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </BlogProvider>
  );
}
