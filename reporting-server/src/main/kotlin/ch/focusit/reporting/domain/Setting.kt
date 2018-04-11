package ch.focusit.reporting.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Dynamique settings
 */
@Document(collection = "settings")
data class Setting(@Id val name: String, val value: String)
