import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
// *** SỬA LỖI IMPORT Ở ĐÂY ***
import app from "@/firebaseConfig"; // Bỏ dấu ngoặc {}

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---

export interface Post {
  id: string;
  title: string;
  content: string;
  categories: string[];
  createdAt: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Dữ liệu để tạo/cập nhật bài viết (không cần id)
export type PostData = Omit<Post, "id" | "createdAt" | "updatedAt">;
export type CategoryData = Omit<Category, "id">;

// --- ĐỊNH NGHĨA CONTEXT TYPE ---

interface BlogContentType {
  user: User | null;
  loading: boolean;
  posts: Post[];
  categories: Category[];
  addPost: (postData: PostData) => Promise<void>;
  updatePost: (postId: string, postData: Partial<PostData>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addCategory: (categoryData: CategoryData) => Promise<void>;
  updateCategory: (categoryId: string, categoryData: Partial<CategoryData>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

// --- KHỞI TẠO CONTEXT ---

const BlogContext = createContext<BlogContentType | undefined>(undefined);

// --- COMPONENT PROVIDER ---

export function BlogProvider({ children }: { children: ReactNode }) {
  // --- STATES ---
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // --- KHỞI TẠO FIREBASE ---
  const auth = getAuth(app);
  const db = getFirestore(app);

  // --- USEEFFECTS ĐỂ LẤY DỮ LIỆU ---

  // Lắng nghe trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // Lắng nghe thay đổi trên collection 'posts'
  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, [db]);

  // Lắng nghe thay đổi trên collection 'categories'
  useEffect(() => {
    const categoriesQuery = query(collection(db, "categories"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(categoriesData);
    });
    return () => unsubscribe();
  }, [db]);


  // --- CÁC HÀM XỬ LÝ DỮ LIỆU (CRUD) ---

  const addPost = useCallback(async (postData: PostData) => {
    await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }, [db]);

  const updatePost = useCallback(async (postId: string, postData: Partial<PostData>) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
        ...postData,
        updatedAt: serverTimestamp(),
    });
  }, [db]);

  const deletePost = useCallback(async (postId: string) => {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
  }, [db]);

  const addCategory = useCallback(async (categoryData: CategoryData) => {
    await addDoc(collection(db, "categories"), categoryData);
  }, [db]);

  const updateCategory = useCallback(async (categoryId: string, categoryData: Partial<CategoryData>) => {
    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, categoryData);
  }, [db]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    const categoryRef = doc(db, "categories", categoryId);
    await deleteDoc(categoryRef);
  }, [db]);


  // --- GIÁ TRỊ CUNG CẤP BỞI CONTEXT ---
  const value = {
    user,
    loading,
    posts,
    categories,
    addPost,
    updatePost,
    deletePost,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

// --- CUSTOM HOOK ---
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
