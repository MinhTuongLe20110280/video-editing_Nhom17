
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

# Hướng dẫn chạy ứng dụng trên nền tảng local

## B1: Clone code theo đường dẫn như bên trên. Lưu ý phải cài đặt module vì file git ignore đã bỏ qua chúng khi push lên github.

## B2: Mở MongoDB ở local, kết nối theo đường dẫn mặc định là mongodb://localhost:27017/ và tạo 1 database có tên là VideoEditing2023.

## B3: Truy cập vào file video-editing-api.sln theo đường dẫn video-editing_Nhom17\server\video-editing-api và mở lên.

## B4: Thực hiện chỉnh sửa ConnectionString trong 3 file appsettings.json, appsettings.Development.json và appsettings.Production.json thành     "ConnectionString": "mongodb://localhost:27017/". Trong đó thể hiện đường dẫn đến mongoDB chạy trên local.

## B5: Chạy file video-editing-api.sln trong visual studio. Sau đó truy cập vào thư mục client theo đường dẫn video-editing_Nhom17\client\client và mở trong Terminal hoặc CMD, nhập lệnh npm start để chạy code. 


