package ch.focusit.reporting.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime
import java.util.*

/**
 * Timbrage
 */
@Document(collection = "times")
data class Time(@Id val id: String? = UUID.randomUUID().toString(), var date: LocalDateTime)