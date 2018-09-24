package ch.focusit.reporting.domain

import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import javax.validation.constraints.NotNull

/**
 * Timbrage
 */
@Document(collection = "times")
data class Time(@Id val id: String? = UUID.randomUUID().toString(), @NotNull var time: LocalDateTime) {
    @JsonIgnore
    fun getDate(): LocalDate {
        return time.toLocalDate()
    }
}

