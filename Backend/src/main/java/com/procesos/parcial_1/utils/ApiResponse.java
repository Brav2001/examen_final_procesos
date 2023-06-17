package com.procesos.parcial_1.utils;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class ApiResponse {
    private String message;
    private Object data;
}
