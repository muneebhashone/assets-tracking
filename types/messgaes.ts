export const coins_err = "user dont have much coins";
export const internal_server_error = "internal server error";
export const shipment_creation_error = "shipment_creation_error";

export const SEARATES_CODES = {
  WRONG_PARAMETERS: "Your request is missing required parameters",
  WRONG_NUMBER: "Invalid bill of lading or booking number indicated",
  WRONG_SEALINE: "Invalid carrier alpha code (SCAC) specified",
  WRONG_TYPE: "The specified document type is invalid",
  SEALINE_NOT_SUPPORTED: "No support for this shipping line",
  SEALINE_TEMPORARY_DISABLED:
    "The requested shipping line is temporarily disconnected",
  SEALINE_UNDER_MAINTENANCE:
    "Support for the requested shipping line is in maintenance status",
  SEALINE_NO_RESPONSE:
    "An error occurred while executing the request. The line is not responding",
  AUTO_CANT_DETECT_SEALINE:
    "Were unable to automatically determine the shipping line",
  AUTO_CANT_DETECT_TYPE: "Were unable to automatically determine the type",
  AUTO_CANT_FIND_INFO: "Could not automatically retrieve the data requested",
  API_KEY_WRONG: "Invalid API key",
  API_KEY_ACCESS_DENIED: "This API key does not have access to the product",
  API_KEY_EXPIRED: "This API key has expired",
  API_KEY_LIMIT_REACHED:
    "This API key has exceeded the limit for the number of requests",
  API_KEY_RATE_LIMIT:
    "This API key has exceeded the allowed request frequency limit",
  UNEXPECTED_ERROR: "Unexpected error",
  OK: "Request completed successfully. There is information on containers and events",
  SEALINE_HASNT_PROVIDE_INFO:
    "Request completed successfully. The line replied that nothing was found for this request",
  SEALINE_CANCELED_SHIPMENT:
    "Request completed successfully. Shipment cancelled",
  NO_CONTAINERS:
    "Request completed successfully. The line did not provide container information",
  NO_EVENTS:
    "Request completed successfully. The line provided information on containers, but did not provide information on events",
};
// export const SEARATES_SUCCCESS_CODES = {};
