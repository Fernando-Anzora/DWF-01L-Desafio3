package sv.edu.udb.bookapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable=false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String author;

    @Min(1000)
    @Max(9999)
    private int publicationYear;

    // getters y setters
    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return id;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getTitle() {
        return title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
    public String getAuthor() {
        return author;
    }

    public void setPublicationYear(int publicationYear) {
        this.publicationYear = publicationYear;
    }
    public int getPublicationYear() {
        return publicationYear;
    }
}
