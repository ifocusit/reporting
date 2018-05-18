package ch.focusit.reporting.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

/**
 * Timbrage
 */
@Document(collection = "times")
data class Time(@Id public val id: String? = UUID.randomUUID().toString(), public var time: LocalDateTime) {
    fun getDate(): LocalDate {
        return time.toLocalDate()
    }
}

