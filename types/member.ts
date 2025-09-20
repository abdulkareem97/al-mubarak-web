// types/member.ts
export interface Member {
  id: string;
  name: string;
  mobileNo: string;
  address: string;
  document: any; // JSON field for storing file information
}

export interface MemberFormData {
  name: string;
  mobileNo: string;
  address: string;
  documents?: File[];
}
