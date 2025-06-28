export interface Machine {
    MachineID: number;
    Name: string;
    Type: string | null;
    Manufacturer: string | null;
    Model: string | null;
    SerialNumber: string | null;
    PurchaseDate: string | null;
    LastMaintenance: string | null;
    Status: boolean;
    Location: string | null;
    Description: string | null;
    CreatedBy: string | null;
    CreateDate: string | null;
    LastUpdate: string | null;
  }
  