export const coins_err = "user dont have much coins";
export const internal_server_error = "internal server error";
export const shipment_creation_error = "shipment_creation_error";

export const SEARATES_CODES = {
  WRONG_PARAMETERS: "Oops! Some parameters are missing.",
  WRONG_NUMBER: "Invalid bill of lading or booking number.",
  WRONG_SEALINE: "Invalid carrier alpha code (SCAC).",
  WRONG_TYPE: "Invalid document type.",
  SEALINE_NOT_SUPPORTED: "Shipping line not supported.",
  SEALINE_TEMPORARY_DISABLED: "Shipping line temporarily unavailable.",
  SEALINE_UNDER_MAINTENANCE: "Shipping line under maintenance.",
  SEALINE_NO_RESPONSE:
    "Error processing request, shipping line not responding.",
  AUTO_CANT_DETECT_SEALINE: "Couldn't detect shipping line automatically.",
  AUTO_CANT_DETECT_TYPE: "Couldn't detect document type automatically.",
  AUTO_CANT_FIND_INFO: "Couldn't retrieve requested data automatically.",
  API_KEY_WRONG: "Invalid API key.",
  API_KEY_ACCESS_DENIED: "API key doesn't have access.",
  API_KEY_EXPIRED: "API key expired.",
  API_KEY_LIMIT_REACHED: "API key request limit reached.",
  API_KEY_RATE_LIMIT: "API key request frequency limit exceeded.",
  UNEXPECTED_ERROR: "Unexpected error.",
  OK: "Request completed successfully with container and event information.",
  SEALINE_HASNT_PROVIDE_INFO: "No information found for this request.",
  SEALINE_CANCELED_SHIPMENT: "Shipment cancelled.",
  NO_CONTAINERS: "No container information available.",
  NO_EVENTS: "Container information available, but no events.",
};
