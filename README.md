
# Hướng dẫn tải và chạy ứng dụng bằng Docker Compose

## B1: Clone code

```
git clone https://github.com/MinhTuongLe20110280/video-editing_Nhom17.git
```

## B2: Mở Docker Desktop lên


## B3: Mở terminal và điều hướng tới thư mục của project vừa clone và có file docker-compose.yml

## B4: Chạy lệnh và đợi docker build xong
```
docker compose up --build
```

## B5: Truy cập vào đường dẫn: http://localhost:3000/login để vào giao diện ứng dụng

## B6: Truy cập và đường dẫn: http://localhost:5001/swagger/index.html để vào giao diện swagger của backend



# HƯỚNG DẪN CHẠY ỨNG DỤNG TRÊN NỀN TẢNG LOCAL


## Bước 1: Clone code theo đường dẫn như bên trên. Lưu ý phải cài đặt module vì file git ignore đã bỏ qua chúng khi push lên github.
git clone https://github.com/MinhTuongLe20110280/video-editing_Nhom17.git

## Bước 2: Mở MongoDB ở local, kết nối theo đường dẫn mặc định là mongodb://localhost:27017/ và tạo 1 database có tên là VideoEditing2023.

## Bước 3: Truy cập vào file video-editing-api.sln theo đường dẫn video-editing_Nhom17\server\video-editing-api và mở lên.

## Bước 4: Thực hiện chỉnh sửa ConnectionString trong 3 file appsettings.json, appsettings.Development.json và appsettings.Production.json thành "ConnectionString": "mongodb://localhost:27017/". Trong đó thể hiện đường dẫn đến mongoDB chạy trên local.

## Bước 5: Chạy file video-editing-api.sln trong visual studio. 

## Bước 6:  Sau đó truy cập vào thư mục client theo đường dẫn video-editing_Nhom17\client\client

## Bước 7: Mở trong Terminal hoặc CMD, nhập lệnh code . để mở trong visual code

## Bước 8: Chỉnh sửa file env thành như sau để gọi đúng API của Backend

## Bước 9: Chuyển sang terminal và nhập lệnh npm start để run code.

## Bước 10: Kết quả sau khi chạy thành công. Sau đó đăng nhập thành công.







