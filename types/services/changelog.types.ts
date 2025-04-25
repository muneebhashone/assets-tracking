export type ChangelogType =
  | "FEATURE"
  | "BUGFIX"
  | "SECURITY"
  | "IMPROVEMENT"
  | "BREAKING_CHANGE";

export interface ChangelogChanges {
  features?: string[];
  fixes?: string[];
  improvements?: string[];
}

export interface Changelog {
  id: number;
  title: string;
  description: string;
  type: ChangelogType;
  releaseDate: string;
  changes: ChangelogChanges;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedChangelogs {
  data: Changelog[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
