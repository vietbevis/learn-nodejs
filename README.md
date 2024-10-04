# Cách sử dụng api;

- Bắt buộc phải login mới sử dụng đc api
- Phần header phải có: x-api-key, client-id (tương ứng với userId), accessToken

# Luồng Login

- B1: Check x-api-key có được đính trên header không?
- B2: Validate body loại bỏ những field dư thừa
- B3: Check tài khoản tồn tại hay chưa dựa trên email
- B4: Tạo cặp khóa publicKey và privateKey
- B5: Sinh accessToken, refreshToken dựa trên privateKey
- B6: Lưu publicKey vào db
- B7: Trả về AT và RT

# Luồng Register (chỉ được đăng ký với ROLE_USER)

- B1: Check x-api-key có được đính trên header không?
- B2: Validate body loại bỏ những field dư thừa
- B3: Check tài khoản tồn tại hay chưa dựa trên email
- B4: Tạo mới user với role mặc định

# Luồng tạo user mới với ROLE_ADMIN

- Tương tự như đăng ký user nhưng sẽ có thể tạo đầy đủ thông tin mà 1 user có thể có

# Luồng logout

- B1: Check x-api-key có được đính trên header không?
- B2: Check AT từ header có hợp lệ không?
- B3: Check RT từ body có hợp lệ không?
- B4: Check RT có đúng là RT đang sử dụng không?
- B5: Đẩy RT đang sử dụng vào blacklist và cập nhật lại publicKey và RT đang sử dụng trong db về rỗng

# Luồng RefreshToken

- B1: Check x-api-key có được đính trên header không?
- B2: Check RT từ body có hợp lệ không?
- B3: Check RT có đúng là RT đang sử dụng không?
- B4: Tạo cặp khóa publicKey và privateKey mới
- B5: Sinh accessToken, refreshToken dựa trên privateKey mới
- B6: Cập nhật lại publicKey và refreshToken vào db

# Bugs

## Post Service

- Check lại tác giả của 1 bài viết có status private mới có thể get bài viết đó
- Tương tự nếu status là friends thì chỉ bạn bè của tác giả và tác giả mới có thể get bài viết đó
