package sv.edu.udb.bookapi.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String msg){ super(msg); }
}
