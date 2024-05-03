export enum shipmentType {
  ZIMLINE = "ZIMLINE",
  SEARATE = "SEARATE",
}

export enum DBErrors {
  UNIQUE_KEY_ERROR = "P2002",
}

export enum userState {
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
}

export enum ShipmentState {
  IN_TRANSIT = "IN_TRANSIT",
  UNKNOWN = "UNKNOWN",
  DELIVERED = "DELIVERED",
  PLANNED = "PLANNED",
}
