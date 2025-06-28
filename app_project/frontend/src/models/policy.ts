export type PolicyType = "p" | "g";

export interface PolicyItem {
  ptype: PolicyType;   // "p" = policy, "g" = grouping
  v0: string;          // subject: user/role
  v1: string;          // object: resource/menu
  v2?: string;         // action: view/create/etc
  v3?: string;
  v4?: string;
  v5?: string;
}

export interface PolicyCreate {
  ptype: PolicyType;
  v0: string;
  v1: string;
  v2?: string;
}
