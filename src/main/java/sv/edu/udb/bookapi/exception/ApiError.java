package sv.edu.udb.bookapi.exception;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Clase que representa un error estándar de la API.
 * Permite dar respuestas claras y consistentes en formato JSON.
 */
public class ApiError {

    // Fecha y hora del error
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    // Código HTTP del error
    private int status;

    // Mensaje de error (genérico o técnico)
    private String message;

    // Lista de errores detallados (por ejemplo validaciones fallidas)
    private List<String> errors;

    public ApiError(int status, String message, List<String> errors) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    // Getters y Setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getErrors() {
        return errors;
    }
}
