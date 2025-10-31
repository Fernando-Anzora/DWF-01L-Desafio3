package sv.edu.udb.bookapi.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Manejo global de excepciones para la API.
 * Centraliza la gestión de errores y los devuelve en formato JSON.
 */
@ControllerAdvice
public class RestExceptionHandler {

    /**
     * Maneja errores de validación de DTOs.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Error de validación",
                errors
        );

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones generales no controladas.
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Error interno en el servidor",
                Collections.singletonList(ex.getLocalizedMessage())
        );

        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Ejemplo: Manejo de recurso no encontrado.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiError apiError = new ApiError(
                HttpStatus.NOT_FOUND.value(),
                "Recurso no encontrado",
                Collections.singletonList(ex.getMessage())
        );

        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }
}
