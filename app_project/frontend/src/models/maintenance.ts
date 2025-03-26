// src/models/maintenance.ts

// Model cho chi tiết phiếu bảo trì
export interface MaintenanceRequestDetail {
    // Đối với create request, RequestDetailID và RequestID có thể chưa có (được tạo sau khi lưu vào database)
    RequestDetailID?: number;
    RequestID?: number;
    MaterialID: number;
    WarehouseID: number;
    QuantityUsed: number;
    // Thuộc tính LastUpdated có thể có khi cập nhật
    LastUpdated?: string;
  }
  
  // Model cho dữ liệu tạo mới phiếu bảo trì
  export interface MaintenanceRequestCreate {
    RequestNumber: string;
    MachineName: string;
    Diagnosis: string;
    RequestedBy: string;
    // Trạng thái có thể được set mặc định (ví dụ: "Pending") từ phía backend
    Status: string;
    // Danh sách chi tiết vật tư
    Details: MaintenanceRequestDetail[];
  }
  
  // Model cho dữ liệu cập nhật phiếu bảo trì (các trường có thể là tùy chọn)
  export interface MaintenanceRequestUpdate {
    MachineName?: string;
    Diagnosis?: string;
    RequestedBy?: string;
    // Danh sách chi tiết để cập nhật (hoặc thêm mới)
    Details?: MaintenanceRequestDetail[];
  }
  
  // Model cho dữ liệu trả về của phiếu bảo trì (response)
  export interface MaintenanceRequestResponse {
    RequestID: number;
    RequestNumber: string;
    MachineName: string;
    Diagnosis: string;
    RequestedBy: string;
    Status: string;
    RequestDate: string;  // ISO string (ví dụ: "2025-03-25T12:00:00Z")
    CreatedAt: string;    // ISO string
    ApprovedAt?: string;  // Có thể có nếu phiếu đã được duyệt
    Details: MaintenanceRequestDetail[];
  }
  