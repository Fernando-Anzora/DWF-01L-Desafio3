package sv.edu.udb.bookapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "DTO para crear un nuevo libro")
public class BookCreateDto {

    @Schema(description = "Título del libro", example = "Cien años de soledad", required = true)
    @NotBlank(message = "El título es obligatorio")
    private String title;

    @Schema(description = "Autor del libro", example = "Gabriel García Márquez", required = true)
    @NotBlank(message = "El autor es obligatorio")
    private String author;

    @Schema(description = "Año de publicación (4 dígitos)", example = "1967", required = true)
    @Min(value = 1000, message = "El año debe ser mayor o igual a 1000")
    @Max(value = 9999, message = "El año debe tener 4 dígitos")
    private Integer publicationYear;

    // Getters y Setters
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }
    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }
}
