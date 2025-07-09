import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

// Component trang đăng nhập
export default function Login() {
  // State để lưu email, mật khẩu và trạng thái loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hooks để điều hướng và hiển thị thông báo
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();

  /**
   * Xử lý logic khi người dùng submit form đăng nhập
   * @param e - Sự kiện submit của form
   */
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Kiểm tra xem email và mật khẩu có được nhập hay không
    if (!email || !password) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ email và mật khẩu.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true); // Bắt đầu quá trình loading

    try {
      // Gọi hàm đăng nhập của Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Hiển thị thông báo thành công
      toast({
        title: "Đăng nhập thành công!",
        description: "Chào mừng bạn đã quay trở lại.",
      });

      // Điều hướng người dùng về trang chủ
      navigate("/");

    } catch (error: any) {
      // Ghi lại lỗi chi tiết ra console để debug
      console.error("LỖI XÁC THỰC FIREBASE:", error);

      // Mặc định thông báo lỗi
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

      // Dịch mã lỗi của Firebase ra thông báo thân thiện với người dùng
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Email hoặc mật khẩu không chính xác.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Địa chỉ email không hợp lệ.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Tài khoản đã bị khóa tạm thời do đăng nhập sai quá nhiều lần.";
          break;
        case 'auth/network-request-failed':
            errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra lại kết nối internet.";
            break;
        default:
          // Giữ lại thông báo lỗi mặc định cho các trường hợp khác
          break;
      }

      // Hiển thị thông báo lỗi
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Kết thúc quá trình loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl">Đăng Nhập</CardTitle>
            <CardDescription>
              Nhập email và mật khẩu của bạn để truy cập vào trang quản trị.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng Nhập"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
