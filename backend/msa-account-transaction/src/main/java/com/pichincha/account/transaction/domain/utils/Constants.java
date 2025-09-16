package com.pichincha.account.transaction.domain.utils;

public class Constants {
    public static final String CLIENT_NOT_FOUND = "Client not found with ID: %s";
    public static final String ACCOUNT_NOT_FOUND =  "Account not found with number: %s";
    public static final String ACCOUNT_TYPE_NOT_FOUND = "Account type not found with ID: %s";
    public static final String TRANSACTION_NOT_FOUND = "Transaction not found with the provided ID: %s";
    public static final String TRANSACTION_TYPE_NOT_FOUND = "Transaction type not found with ID: %s";
    public static final String INSUFFICIENT_BALANCE = "Insufficient balance for withdrawal.";
    public static final String BAD_REQUEST = "Invalid request data.";
    public static final String PDF_GENERATION_ERROR = "Error generating PDF.";
    public static final String CLIENT_ALREADY_EXISTS ="Client with identification: %s, already exists.";
    public static final String ACCOUNT_ALREADY_EXISTS = "Account with number '%s' and type ID '%s' already exists.";

    public static final String EXCEPTION_TITLE = "Transaction Exception";
    public static final String EXCEPTION_DETAIL = "There is a problem executing your transaction.";
    public static final String EXCEPTION_MESSAGE_VALIDATION = "Validation Error";
    public static final String EXCEPTION_CONSTRAINT_VIOLATION_TITTLE = "Constraint Violation Exception";

    public static final String X_DEVICE = "x-device";
    public static final String X_AGENCY =  "x-agency";
    public static final String X_GEOLOCATION = "x-geolocation";
}

