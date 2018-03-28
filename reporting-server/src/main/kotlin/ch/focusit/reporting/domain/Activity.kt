package ch.focusit.reporting.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Duration
import java.time.LocalDate

/**
 * Activité quotidienne
 */
@Document(collection = "activities")
data class Activity(@Id val date: LocalDate, var duration: Duration?, var type: ActivityType = ActivityType.WORK)

enum class ActivityType {
    WORK, OFF
}
